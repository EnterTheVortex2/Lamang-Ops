import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckSquare,
  ChevronDown,
  Eye,
  GripVertical,
  Hammer,
  KeyRound,
  Map as MapIcon,
  Maximize2,
  Minimize2,
  Pencil,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  doesTaskBelongToFaction,
  FACTIONS,
  type CustomMapPin,
  type FactionId,
} from "./config/mapConfig";
import type {
  DisassemblyRecipeDef,
  HideoutUpgradeDef,
} from "./data/hideoutData";
import {
  HideoutTrackerPanel,
  type PlannerViewId,
} from "./components/HideoutTrackerPanel";
import { KeysDoorsPanel } from "./components/KeysDoorsPanel";
import { LegalPrivacyPanel } from "./components/LegalPrivacyPanel";
import { TasksTrackerPanel } from "./components/TasksTrackerPanel";
import { TacticalMapPanel } from "./components/TacticalMapPanel";
import { VendorShopPanel } from "./components/VendorShopPanel";
import {
  discoverAndFetchAllDatasets,
  loadCachedApiData,
  lookupMaterialSpawnIntel,
  safeStorageGet,
  safeStorageSet,
  type ApiCachePayload,
  type ItemSpawnLookupResult,
  type NormalizedApiRecord,
} from "./services/gzwApi";
import {
  buildAllHideoutUpgrades,
  buildDisassemblyCatalogMaterial,
  buildDisassemblyRecipes,
  buildMaterialsCatalog,
  type CatalogMaterial,
} from "./utils/catalogBuilder";
import { buildKeysAndDoorsCatalog, type GzwKeyDoorDef } from "./utils/keyBuilder";
import {
  eraseAllAppData,
  exportAllAppDataBackup,
  loadActiveOperatorId,
  loadOperatorProfiles,
  loadOperatorSnapshot,
  OPERATOR_SLOT_IDS,
  restoreAllAppDataBackup,
  saveActiveOperatorId,
  saveOperatorProfiles,
  saveOperatorSnapshot,
  type OperatorProfileMeta,
  type OperatorSlotId,
  type OperatorStateSnapshot,
} from "./utils/operatorStorage";
import {
  buildAllTasks,
  buildVendorProfiles,
  type GzwTaskDef,
} from "./utils/taskBuilder";
import { buildVendorShopCatalog } from "./utils/vendorBuilder";

const PANEL_WIDTH_KEY = "lamang_ops_panel_width_v1";

const DEFAULT_COMPACT_WIDTH = 468;
const MIN_PANEL_WIDTH = 360;

type ApiStatusMode = "loading" | "live" | "cached" | "error";
type WorkspaceMode = "hideout" | "tasks" | "vendors" | "keys" | "legal";
type MobileTab = "hideout" | "tasks" | "vendors" | "keys" | "map" | "legal";

function clampPanelWidth(rawWidth: number): number {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  const maxAllowed = Math.max(460, Math.min(960, Math.round(vw * 0.72)));
  return Math.max(MIN_PANEL_WIDTH, Math.min(maxAllowed, Math.round(rawWidth)));
}

export default function App() {
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("hideout");
  const [mobileTab, setMobileTab] = useState<MobileTab>("hideout");
  const [glanceMode, setGlanceMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [panelWidth, setPanelWidth] = useState<number>(() => {
    const saved = safeStorageGet<number>(PANEL_WIDTH_KEY, DEFAULT_COMPACT_WIDTH);
    return clampPanelWidth(typeof saved === "number" ? saved : DEFAULT_COMPACT_WIDTH);
  });
  const [isDraggingSplitter, setIsDraggingSplitter] = useState(false);
  const panelWidthRef = useRef(panelWidth);
  panelWidthRef.current = panelWidth;

  const isWidePanel = panelWidth >= 660;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setIsDesktop(mq.matches);
      setPanelWidth((prev) => clampPanelWidth(prev));
    };
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const toggleExpandPreset = useCallback(() => {
    setPanelWidth((prev) => {
      const target =
        prev >= 620
          ? DEFAULT_COMPACT_WIDTH
          : clampPanelWidth(Math.round(window.innerWidth * 0.56));
      safeStorageSet(PANEL_WIDTH_KEY, target);
      return target;
    });
  }, []);

  const handleSplitterPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = panelWidthRef.current;
      setIsDraggingSplitter(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      let rafId = 0;
      const onPointerMove = (moveEvent: PointerEvent) => {
        const delta = moveEvent.clientX - startX;
        const nextWidth = clampPanelWidth(startWidth + delta);
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setPanelWidth(nextWidth);
        });
      };

      const onPointerUp = () => {
        if (rafId) cancelAnimationFrame(rafId);
        setIsDraggingSplitter(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        safeStorageSet(PANEL_WIDTH_KEY, panelWidthRef.current);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    },
    []
  );

  const [activeView, setActiveView] = useState<PlannerViewId>("planner");
  const [apiCache, setApiCache] = useState<ApiCachePayload | null>(() =>
    loadCachedApiData()
  );
  const [apiStatus, setApiStatus] = useState<{
    mode: ApiStatusMode;
    label: string;
  }>(() => {
    const cached = loadCachedApiData();
    if (cached) {
      const count = Object.values(cached.datasets).reduce(
        (acc, list) => acc + list.length,
        0
      );
      return { mode: "cached", label: `Cached (${count.toLocaleString()})` };
    }
    return { mode: "loading", label: "Syncing data..." };
  });

  // Multi-Operator Slots (Operator 1 / Operator 2 / Operator 3)
  const [activeOperatorId, setActiveOperatorId] = useState<OperatorSlotId>(() =>
    loadActiveOperatorId()
  );
  const activeOperatorIdRef = useRef<OperatorSlotId>(activeOperatorId);
  activeOperatorIdRef.current = activeOperatorId;

  const [operatorProfiles, setOperatorProfiles] = useState<OperatorProfileMeta[]>(
    () => loadOperatorProfiles()
  );
  const [opState, setOpState] = useState<OperatorStateSnapshot>(() =>
    loadOperatorSnapshot(loadActiveOperatorId())
  );
  const [operatorMenuOpen, setOperatorMenuOpen] = useState(false);
  const [renamingOpId, setRenamingOpId] = useState<OperatorSlotId | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const operatorMenuRef = useRef<HTMLDivElement | null>(null);

  const updateOpState = useCallback(
    (updater: (prev: OperatorStateSnapshot) => OperatorStateSnapshot) => {
      const slotId = activeOperatorIdRef.current;
      setOpState((prev) => {
        const next = updater(prev);
        saveOperatorSnapshot(slotId, next);
        return next;
      });
    },
    []
  );

  const builtUpgrades = opState.builtUpgrades;
  const plannedUpgrades = opState.plannedUpgrades;
  const stashCounts = opState.stashCounts;
  const completedTasks = opState.completedTasks;
  const ownedKeys = opState.ownedKeys;
  const tickedMapMaterials = opState.tickedMapMaterials;
  const customPins = opState.customPins;
  const selectedFaction = opState.faction;

  const activeOperatorProfile = useMemo(
    () =>
      operatorProfiles.find((p) => p.id === activeOperatorId) || {
        id: activeOperatorId,
        name: "Operator 1",
        faction: selectedFaction,
        updatedAt: Date.now(),
      },
    [operatorProfiles, activeOperatorId, selectedFaction]
  );

  useEffect(() => {
    if (!operatorMenuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        operatorMenuRef.current &&
        !operatorMenuRef.current.contains(e.target as Node)
      ) {
        setOperatorMenuOpen(false);
        setRenamingOpId(null);
      }
    };
    window.addEventListener("mousedown", handleOutside);
    return () => window.removeEventListener("mousedown", handleOutside);
  }, [operatorMenuOpen]);

  const [selectedUpgrade, setSelectedUpgrade] =
    useState<HideoutUpgradeDef | null>(null);
  const [inspectedMaterial, setInspectedMaterial] =
    useState<CatalogMaterial | null>(null);
  const [inspectedLookup, setInspectedLookup] =
    useState<ItemSpawnLookupResult | null>(null);
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [inspectedTask, setInspectedTask] = useState<GzwTaskDef | null>(null);
  const [inspectedKey, setInspectedKey] = useState<GzwKeyDoorDef | null>(null);

  const [pinDropMode, setPinDropMode] = useState(false);
  const [preselectedPinMatId, setPreselectedPinMatId] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const handleRefreshApi = useCallback(
    async (isManual = false) => {
      setApiStatus({ mode: "loading", label: "Syncing data..." });
      try {
        const fresh = await discoverAndFetchAllDatasets(isManual);
        setApiCache(fresh);
        const total = Object.values(fresh.datasets).reduce(
          (acc, list) => acc + list.length,
          0
        );
        setApiStatus({ mode: "live", label: `${total.toLocaleString()} items live` });
        if (isManual) {
          showToast(
            `Updated ${total.toLocaleString()} items across ${fresh.discoveredDatasets.length} datasets`
          );
        }
      } catch {
        const existing = loadCachedApiData();
        if (existing) {
          const total = Object.values(existing.datasets).reduce(
            (acc, list) => acc + list.length,
            0
          );
          setApiStatus({ mode: "cached", label: `Cached (${total.toLocaleString()})` });
          if (isManual) showToast("Server busy — using cached game data");
        } else {
          setApiStatus({ mode: "error", label: "Offline 0.5 data" });
          if (isManual) showToast("Using built-in Update 0.5 dataset");
        }
      }
    },
    [showToast]
  );

  useEffect(() => {
    handleRefreshApi(false);
  }, [handleRefreshApi]);

  const allUpgrades = useMemo(
    () => buildAllHideoutUpgrades(apiCache),
    [apiCache]
  );
  const catalog = useMemo(
    () => buildMaterialsCatalog(apiCache, allUpgrades),
    [apiCache, allUpgrades]
  );
  const disassemblyRecipes = useMemo(
    () => buildDisassemblyRecipes(apiCache),
    [apiCache]
  );
  const vendors = useMemo(() => buildVendorProfiles(apiCache), [apiCache]);
  const vendorShopItems = useMemo(
    () => buildVendorShopCatalog(apiCache),
    [apiCache]
  );
  const allTasks = useMemo(() => buildAllTasks(apiCache), [apiCache]);
  const keysCatalog = useMemo(
    () => buildKeysAndDoorsCatalog(apiCache, allTasks),
    [apiCache, allTasks]
  );

  const builtCount = useMemo(
    () => allUpgrades.filter((u) => builtUpgrades[u.id]).length,
    [allUpgrades, builtUpgrades]
  );

  const factionTasks = useMemo(
    () =>
      selectedFaction === "ALL"
        ? allTasks
        : allTasks.filter((t) =>
            doesTaskBelongToFaction(t.faction, t.areas, selectedFaction)
          ),
    [allTasks, selectedFaction]
  );

  const completedTasksCount = useMemo(
    () => factionTasks.filter((t) => completedTasks[t.id]).length,
    [factionTasks, completedTasks]
  );

  const ownedKeysCount = useMemo(
    () => keysCatalog.filter((k) => ownedKeys[k.id]).length,
    [keysCatalog, ownedKeys]
  );

  const allApiRecords = useMemo(() => {
    const list: NormalizedApiRecord[] = [];
    if (!apiCache?.datasets) return list;
    Object.values(apiCache.datasets).forEach((arr) => {
      if (Array.isArray(arr)) list.push(...arr);
    });
    return list;
  }, [apiCache]);

  const handleToggleBuilt = useCallback(
    (upgradeId: string) => {
      updateOpState((prev) => ({
        ...prev,
        builtUpgrades: {
          ...prev.builtUpgrades,
          [upgradeId]: !prev.builtUpgrades[upgradeId],
        },
      }));
    },
    [updateOpState]
  );

  const handleTogglePlanned = useCallback(
    (upgradeId: string) => {
      updateOpState((prev) => ({
        ...prev,
        plannedUpgrades: {
          ...prev.plannedUpgrades,
          [upgradeId]: !prev.plannedUpgrades[upgradeId],
        },
      }));
    },
    [updateOpState]
  );

  const handleSetStashCount = useCallback(
    (key: string, value: number) => {
      updateOpState((prev) => ({
        ...prev,
        stashCounts: {
          ...prev.stashCounts,
          [key]: Math.max(0, value),
        },
      }));
    },
    [updateOpState]
  );

  const handleToggleTaskComplete = useCallback(
    (taskId: string) => {
      updateOpState((prev) => ({
        ...prev,
        completedTasks: {
          ...prev.completedTasks,
          [taskId]: !prev.completedTasks[taskId],
        },
      }));
    },
    [updateOpState]
  );

  const handleToggleOwnedKey = useCallback(
    (keyId: string) => {
      updateOpState((prev) => ({
        ...prev,
        ownedKeys: {
          ...prev.ownedKeys,
          [keyId]: !prev.ownedKeys[keyId],
        },
      }));
    },
    [updateOpState]
  );

  const handleToggleMapMaterial = useCallback(
    (matKey: string, visible: boolean) => {
      updateOpState((prev) => ({
        ...prev,
        tickedMapMaterials: {
          ...prev.tickedMapMaterials,
          [matKey]: visible,
        },
      }));
      if (visible) showToast("Material spawn zones pinned to map");
    },
    [updateOpState, showToast]
  );

  const handleInspectMaterial = useCallback(async (mat: CatalogMaterial) => {
    setInspectedTask(null);
    setInspectedKey(null);
    setInspectedMaterial(mat);
    setInspectedLookup(null);
    setIsLookupLoading(true);
    if (window.innerWidth < 1024) {
      setMobileTab("map");
    }
    try {
      const lookup = await lookupMaterialSpawnIntel(mat.name);
      setInspectedLookup(lookup);
    } finally {
      setIsLookupLoading(false);
    }
  }, []);

  const handleInspectDisassemblyItem = useCallback(
    (recipe: DisassemblyRecipeDef) => {
      const mat = buildDisassemblyCatalogMaterial(recipe);
      handleInspectMaterial(mat);
    },
    [handleInspectMaterial]
  );

  const handleLocateTaskOnMap = useCallback((task: GzwTaskDef) => {
    setInspectedMaterial(null);
    setInspectedKey(null);
    setInspectedTask(task);
    if (window.innerWidth < 1024) {
      setMobileTab("map");
    }
  }, []);

  const handleLocateKeyOnMap = useCallback((keyDef: GzwKeyDoorDef) => {
    setInspectedMaterial(null);
    setInspectedTask(null);
    setInspectedKey(keyDef);
    if (window.innerWidth < 1024) {
      setMobileTab("map");
    }
  }, []);

  const handleInspectApiRecord = useCallback(
    (rec: NormalizedApiRecord) => {
      const existing = catalog.find(
        (m) => m.name.toLowerCase() === rec.name.toLowerCase()
      );
      if (existing) {
        handleInspectMaterial(existing);
        return;
      }
      handleInspectMaterial({
        key: rec.uid,
        id: rec.id,
        name: rec.name,
        room: "all",
        dataset: rec.dataset,
        required: 1,
        tiersUsed: [],
        layerHint: "apiLoot",
        image: rec.image,
        description: rec.description || `Record from ${rec.dataset}`,
        weight: rec.weight,
        gridSize: rec.gridSize,
        sellPrice: rec.sellPrice,
        spawnNotes: rec.spawnNotes.length
          ? rec.spawnNotes
          : [`${rec.dataset.replace(/_/g, " ")} spawn`],
        usedInUpgrades: [],
        apiCoords: rec.coords ? [{ ...rec.coords, label: rec.name }] : [],
      });
    },
    [catalog, handleInspectMaterial]
  );

  const handleAddPin = useCallback(
    (pin: CustomMapPin) => {
      updateOpState((prev) => ({
        ...prev,
        customPins: [...prev.customPins, pin],
      }));
    },
    [updateOpState]
  );

  const handleUpdatePin = useCallback(
    (updated: CustomMapPin) => {
      updateOpState((prev) => ({
        ...prev,
        customPins: prev.customPins.map((p) =>
          p.id === updated.id ? updated : p
        ),
      }));
      showToast("Map pin updated");
    },
    [updateOpState, showToast]
  );

  const handleRemovePin = useCallback(
    (pinId: string) => {
      updateOpState((prev) => ({
        ...prev,
        customPins: prev.customPins.filter((p) => p.id !== pinId),
      }));
      showToast("Map pin removed");
    },
    [updateOpState, showToast]
  );

  const handleResetProgress = () => {
    const opName = activeOperatorProfile.name;
    if (workspaceMode === "tasks") {
      updateOpState((prev) => ({ ...prev, completedTasks: {} }));
      showToast(`Cleared task progress for ${opName}`);
    } else if (workspaceMode === "keys") {
      updateOpState((prev) => ({ ...prev, ownedKeys: {} }));
      showToast(`Cleared keyholder list for ${opName}`);
    } else if (workspaceMode === "vendors") {
      showToast("Vendor shop is synced live from gzw-data.dev");
    } else if (workspaceMode === "legal") {
      showToast("Use Erase my app data in Data Controls to wipe all saved progress");
    } else {
      updateOpState((prev) => ({
        ...prev,
        builtUpgrades: {},
        plannedUpgrades: {},
        stashCounts: {},
      }));
      showToast(`Cleared hideout progress for ${opName}`);
    }
  };

  const handleArmPinDrop = (matId: string) => {
    setPreselectedPinMatId(matId);
    setPinDropMode(true);
    if (window.innerWidth < 1024) {
      setMobileTab("map");
    }
    showToast("Click anywhere on Lamang Island to copy X / Y and attach pin");
  };

  const handleSelectFaction = useCallback(
    (nextFaction: FactionId) => {
      const slotId = activeOperatorIdRef.current;
      updateOpState((prev) => ({ ...prev, faction: nextFaction }));
      setOperatorProfiles((prev) => {
        const next = prev.map((p) =>
          p.id === slotId
            ? { ...p, faction: nextFaction, updatedAt: Date.now() }
            : p
        );
        saveOperatorProfiles(next);
        return next;
      });

      if (nextFaction === "ALL") {
        showToast(`${activeOperatorProfile.name}: showing all factions`);
      } else {
        const info = FACTIONS[nextFaction];
        showToast(
          `${activeOperatorProfile.name} faction: ${info.short} · Starter: ${info.starterTown}`
        );
      }
    },
    [updateOpState, activeOperatorProfile.name, showToast]
  );

  const handleSelectOperator = useCallback(
    (nextSlotId: OperatorSlotId) => {
      if (nextSlotId === activeOperatorIdRef.current) {
        setOperatorMenuOpen(false);
        return;
      }
      const currentSlot = activeOperatorIdRef.current;
      saveOperatorSnapshot(currentSlot, opState);

      const loaded = loadOperatorSnapshot(nextSlotId);
      saveActiveOperatorId(nextSlotId);
      setActiveOperatorId(nextSlotId);
      setOpState(loaded);
      setOperatorMenuOpen(false);
      setRenamingOpId(null);

      setOperatorProfiles((prev) => {
        const next = prev.map((p) =>
          p.id === nextSlotId
            ? { ...p, faction: loaded.faction, updatedAt: Date.now() }
            : p
        );
        saveOperatorProfiles(next);
        return next;
      });

      const targetMeta = operatorProfiles.find((p) => p.id === nextSlotId);
      const label = targetMeta?.name || "Operator";
      const factionSuffix =
        loaded.faction === "ALL" ? "All Factions" : loaded.faction;
      showToast(`Switched to ${label} (${factionSuffix})`);
    },
    [opState, operatorProfiles, showToast]
  );

  const handleCommitRenameOperator = useCallback(
    (slotId: OperatorSlotId) => {
      const trimmed = renameDraft.trim();
      if (!trimmed) {
        setRenamingOpId(null);
        return;
      }
      setOperatorProfiles((prev) => {
        const next = prev.map((p) =>
          p.id === slotId ? { ...p, name: trimmed, updatedAt: Date.now() } : p
        );
        saveOperatorProfiles(next);
        return next;
      });
      setRenamingOpId(null);
      showToast(`Renamed slot to ${trimmed}`);
    },
    [renameDraft, showToast]
  );

  const operatorSlotSummaries = useMemo(() => {
    return OPERATOR_SLOT_IDS.map((id) => {
      const meta = operatorProfiles.find((p) => p.id === id);
      const snap = id === activeOperatorId ? opState : loadOperatorSnapshot(id);
      const built = Object.values(snap.builtUpgrades).filter(Boolean).length;
      const tasks = Object.values(snap.completedTasks).filter(Boolean).length;
      const pins = snap.customPins.filter((p) => !p.id.startsWith("seed-")).length;
      return {
        id,
        name: meta?.name || `Operator ${id.replace("op-", "")}`,
        faction: snap.faction,
        built,
        tasks,
        pins,
      };
    });
  }, [operatorProfiles, activeOperatorId, opState]);

  const totalStorageSummary = useMemo(
    () =>
      operatorSlotSummaries.reduce(
        (acc, slot) => ({
          builtTotal: acc.builtTotal + slot.built,
          tasksTotal: acc.tasksTotal + slot.tasks,
          keysTotal:
            acc.keysTotal +
            Object.values(
              (slot.id === activeOperatorId
                ? opState
                : loadOperatorSnapshot(slot.id)
              ).ownedKeys
            ).filter(Boolean).length,
          pinsTotal:
            acc.pinsTotal +
            (slot.id === activeOperatorId
              ? opState
              : loadOperatorSnapshot(slot.id)
            ).customPins.length,
        }),
        { builtTotal: 0, tasksTotal: 0, keysTotal: 0, pinsTotal: 0 }
      ),
    [operatorSlotSummaries, activeOperatorId, opState]
  );

  const handleExportBackup = useCallback(() => {
    saveOperatorSnapshot(activeOperatorIdRef.current, opState);
    const payload = exportAllAppDataBackup(panelWidthRef.current);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const dateStamp = new Date().toISOString().slice(0, 10);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `lamang-operations-backup-${dateStamp}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    showToast("Downloaded full progress backup (.json)");
  }, [opState, showToast]);

  const handleRestoreBackup = useCallback(
    (rawJson: string): { ok: boolean; message: string } => {
      try {
        const restored = restoreAllAppDataBackup(rawJson);
        setActiveOperatorId(restored.activeOperatorId);
        setOperatorProfiles(restored.profiles);
        setOpState(restored.activeSnapshot);
        if (restored.panelWidth) {
          setPanelWidth(clampPanelWidth(restored.panelWidth));
        }
        const msg = `Restored ${restored.summary.builtTotal} upgrades, ${restored.summary.tasksTotal} tasks, ${restored.summary.keysTotal} keys & ${restored.summary.pinsTotal} pins.`;
        showToast(msg);
        return { ok: true, message: msg };
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to restore backup file.";
        showToast(msg);
        return { ok: false, message: msg };
      }
    },
    [showToast]
  );

  const handleEraseAllData = useCallback(() => {
    const fresh = eraseAllAppData();
    setActiveOperatorId(fresh.activeOperatorId);
    setOperatorProfiles(fresh.profiles);
    setOpState(fresh.activeSnapshot);
    setSelectedUpgrade(null);
    setInspectedMaterial(null);
    setInspectedTask(null);
    setInspectedKey(null);
    showToast("All saved browser app data erased");
  }, [showToast]);

  const handleToggleGlanceMode = useCallback(
    (force?: boolean) => {
      setGlanceMode((prev) => {
        const next = force !== undefined ? force : !prev;
        if (next) {
          if (workspaceMode === "vendors" || workspaceMode === "legal") {
            setWorkspaceMode("hideout");
          }
          if (window.innerWidth < 1024) {
            setMobileTab("map");
          }
          showToast("Glance Mode on — clean Monitor 2 map & heading HUD");
        }
        return next;
      });
    },
    [workspaceMode, showToast]
  );

  const activeModeProgress =
    workspaceMode === "tasks"
      ? { done: completedTasksCount, total: factionTasks.length }
      : workspaceMode === "keys"
        ? { done: ownedKeysCount, total: keysCatalog.length }
        : workspaceMode === "vendors"
          ? { done: vendorShopItems.length, total: vendorShopItems.length }
          : { done: builtCount, total: allUpgrades.length };
  const progressPct =
    activeModeProgress.total > 0
      ? Math.round((activeModeProgress.done / activeModeProgress.total) * 100)
      : 0;

  const isSidebarVisibleOnMobile = mobileTab !== "map";

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-[#080b10] text-[#e8eef5] overflow-hidden">
      {/* Sleek Single-Line Top Bar */}
      <header className="h-12 shrink-0 px-3 sm:px-4 border-b border-white/[0.075] bg-[#0e131b]/95 backdrop-blur-md flex items-center justify-between gap-2 sm:gap-3 z-40">
        {/* Brand Wordmark + Operator Profile Switcher + Compact Faction Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap shrink-0 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-[13px] sm:text-[17px] font-semibold tracking-tight text-[#f8fafc]">
              Lamang Operations
            </span>
          </div>

          {/* Multi-Operator Slot Switcher (Operator 1 / 2 / 3) */}
          <div className="relative" ref={operatorMenuRef}>
            <button
              type="button"
              aria-label="Switch operator profile"
              aria-expanded={operatorMenuOpen}
              onClick={() => setOperatorMenuOpen((v) => !v)}
              className="min-h-[32px] inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-[#0a0e14] border border-white/[0.09] hover:border-[#38bdf8]/55 text-xs font-medium text-[#eef3f8] transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
              <span className="max-w-[68px] sm:max-w-[120px] truncate">
                {activeOperatorProfile.name}
              </span>
              {selectedFaction !== "ALL" && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: FACTIONS[selectedFaction].color }}
                />
              )}
              <ChevronDown className="w-3 h-3 text-[#7f8ea1] shrink-0" />
            </button>

            {operatorMenuOpen && (
              <div className="gzw-popover-enter absolute top-full left-0 mt-1.5 w-80 max-w-[calc(100vw-24px)] rounded-xl bg-[#0e131b]/98 backdrop-blur-xl border border-white/[0.12] p-2 shadow-2xl z-[1200] space-y-1.5">
                <div className="px-2 py-1 flex items-center justify-between border-b border-white/[0.07]">
                  <span className="text-[11px] font-semibold text-[#e2e8f0]">
                    Operator Slots (Local Saves)
                  </span>
                  <span className="text-[10px] text-[#7f8ea1]">
                    Saved per character
                  </span>
                </div>

                {operatorSlotSummaries.map((slot) => {
                  const isActive = slot.id === activeOperatorId;
                  const isRenaming = renamingOpId === slot.id;
                  const factionInfo =
                    slot.faction !== "ALL" ? FACTIONS[slot.faction] : null;
                  return (
                    <div
                      key={slot.id}
                      className={`rounded-lg border px-2.5 py-2 transition-colors ${
                        isActive
                          ? "bg-[#141b26] border-[#38bdf8]/65"
                          : "bg-[#0a0e14] border-white/[0.07] hover:border-white/[0.16]"
                      }`}
                    >
                      {isRenaming ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            autoFocus
                            maxLength={24}
                            value={renameDraft}
                            onChange={(e) => setRenameDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleCommitRenameOperator(slot.id);
                              } else if (e.key === "Escape") {
                                setRenamingOpId(null);
                              }
                            }}
                            aria-label="Operator slot name"
                            className="flex-1 min-w-0 bg-[#080b10] border border-[#38bdf8] rounded-md px-2 py-1 text-xs text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            aria-label="Save operator name"
                            onClick={() => handleCommitRenameOperator(slot.id)}
                            className="p-1.5 rounded bg-[#e5a93c] text-[#090d12] font-semibold"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectOperator(slot.id)}
                            className="flex-1 min-w-0 text-left"
                          >
                            <div className="flex items-center gap-1.5">
                              {isActive && (
                                <Check className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                              )}
                              <span className="text-xs font-semibold text-[#f8fafc] truncate">
                                {slot.name}
                              </span>
                              <span
                                className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/[0.06] text-[#cbd5e1] shrink-0"
                              >
                                {factionInfo && (
                                  <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: factionInfo.color }}
                                  />
                                )}
                                {slot.faction === "ALL" ? "All" : slot.faction}
                              </span>
                            </div>
                            <div className="font-mono-tabular text-[10px] text-[#8b98a9] mt-1">
                              {slot.built} built · {slot.tasks} tasks · {slot.pins} pins
                            </div>
                          </button>
                          <button
                            type="button"
                            title={`Rename ${slot.name}`}
                            aria-label={`Rename ${slot.name}`}
                            onClick={() => {
                              setRenamingOpId(slot.id);
                              setRenameDraft(slot.name);
                            }}
                            className="p-1.5 rounded-md text-[#8b98a9] hover:text-[#e5a93c] hover:bg-white/[0.07] shrink-0 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop/Tablet Segmented Faction Switcher */}
          <div
            role="group"
            aria-label="Select faction"
            className="hidden sm:flex items-center rounded-lg bg-[#0a0e14] border border-white/[0.08] p-0.5"
          >
            {(["ALL", "LRI", "MSS", "CSI"] as FactionId[]).map((fId) => {
              const isSelected = selectedFaction === fId;
              const info = fId === "ALL" ? null : FACTIONS[fId];
              return (
                <button
                  key={fId}
                  type="button"
                  title={
                    info
                      ? `${info.name} · Starter Town: ${info.starterTown}`
                      : "Show all factions"
                  }
                  onClick={() => handleSelectFaction(fId)}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    isSelected
                      ? "bg-[#141b26] text-[#f8fafc] shadow-sm ring-1 ring-white/[0.08]"
                      : "text-[#8b98a9] hover:text-[#e2e8f0]"
                  }`}
                >
                  {info && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: info.color }}
                    />
                  )}
                  <span>{fId === "ALL" ? "All" : fId}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Data Sync + Glance Mode Exit + Mobile Faction Select + Counter + Reset */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {glanceMode && (
            <button
              type="button"
              onClick={() => handleToggleGlanceMode(false)}
              className="min-h-[32px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#e5a93c]/18 border border-[#e5a93c]/55 text-[#fde68a] hover:bg-[#e5a93c]/28 transition-colors whitespace-nowrap shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Exit Glance</span>
            </button>
          )}

          <select
            aria-label="Select faction mobile"
            value={selectedFaction}
            onChange={(e) => handleSelectFaction(e.target.value as FactionId)}
            className="sm:hidden min-h-[32px] rounded-lg bg-[#0a0e14] border border-white/[0.1] px-1.5 text-xs font-semibold text-[#f1f5f9] focus:outline-none focus:border-[#e5a93c]"
          >
            <option value="ALL">All</option>
            <option value="LRI">LRI</option>
            <option value="MSS">MSS</option>
            <option value="CSI">CSI</option>
          </select>
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#94a3b8] whitespace-nowrap">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                apiStatus.mode === "live"
                  ? "bg-emerald-400"
                  : apiStatus.mode === "cached"
                    ? "bg-[#e5a93c]"
                    : apiStatus.mode === "loading"
                      ? "bg-[#38bdf8] animate-pulse"
                      : "bg-red-500"
              }`}
            />
            <span>{apiStatus.label}</span>
          </div>

          <button
            type="button"
            disabled={apiStatus.mode === "loading"}
            onClick={() => handleRefreshApi(true)}
            aria-label="Sync Game Data"
            className="min-h-[32px] inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium text-[#e2e8f0] hover:text-white border border-white/[0.09] hover:border-white/[0.18] bg-[#141b26]/70 hover:bg-[#141b26] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                apiStatus.mode === "loading" ? "animate-spin" : ""
              }`}
            />
            <span className="hidden xl:inline">Sync Data</span>
          </button>

          <div className="text-right hidden sm:block pl-1">
            <div className="font-mono-tabular text-xs font-semibold text-[#f1f5f9]">
              {activeModeProgress.done}{" "}
              <span className="text-[11px] font-normal text-[#7f8ea1]">
                / {activeModeProgress.total}
              </span>
            </div>
            <div className="w-16 sm:w-20 h-1 bg-white/[0.08] rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-[#e5a93c] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetProgress}
            title={`Reset ${workspaceMode} progress for ${activeOperatorProfile.name}`}
            className="min-h-[32px] inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium text-[#94a3b8] hover:text-white border border-white/[0.08] hover:border-white/[0.18] bg-white/[0.025] hover:bg-white/[0.06] transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (workspaceMode === "legal") {
                setWorkspaceMode("hideout");
                setMobileTab("hideout");
              } else {
                setGlanceMode(false);
                setWorkspaceMode("legal");
                setMobileTab("legal");
              }
            }}
            aria-pressed={workspaceMode === "legal"}
            title="Privacy notice, legal terms & data controls"
            className={`hidden lg:inline-flex min-h-[32px] items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
              workspaceMode === "legal"
                ? "bg-[#e5a93c]/16 border-[#e5a93c]/55 text-[#fde68a]"
                : "text-[#94a3b8] hover:text-white border-white/[0.08] hover:border-white/[0.18] bg-white/[0.025] hover:bg-white/[0.06]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#e5a93c]" />
            <span>Privacy &amp; Legal</span>
          </button>
        </div>
      </header>

      {/* Responsive Workspace: Fluid Draggable Split Sidebar + Dominant Map on Desktop, Full-Screen Tabbed Views on Mobile */}
      <main className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Operations Panel (Hideout + Tasks + Vendors + Keys + Legal, hidden when Glance Mode is active on Desktop) */}
        <aside
          style={
            isDesktop &&
            workspaceMode !== "vendors" &&
            workspaceMode !== "legal" &&
            !glanceMode
              ? { width: `${panelWidth}px` }
              : undefined
          }
          className={`${
            glanceMode
              ? "hidden"
              : isSidebarVisibleOnMobile
                ? "flex"
                : "hidden lg:flex"
          } flex-col flex-1 ${
            workspaceMode === "vendors" || workspaceMode === "legal"
              ? "lg:flex-1 lg:w-full"
              : "lg:flex-none lg:shrink-0 lg:border-r border-white/[0.075]"
          } min-h-0 bg-[#0e131b] ${
            isDraggingSplitter ? "" : "transition-[width] duration-150"
          }`}
        >
          {/* Desktop Workspace Mode Bar + Expand/Compact Width Preset Toggle */}
          <div className="hidden lg:flex items-center justify-between gap-2 px-3.5 py-2 border-b border-white/[0.075] bg-[#0e131b] shrink-0">
            <div className="flex items-center gap-0.5 rounded-lg bg-[#0a0e14] border border-white/[0.07] p-0.5 min-w-0">
              <button
                type="button"
                onClick={() => {
                  setWorkspaceMode("hideout");
                  setMobileTab("hideout");
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11.5px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                  workspaceMode === "hideout"
                    ? "bg-[#141b26] text-[#f8fafc] shadow-sm ring-1 ring-white/[0.08]"
                    : "text-[#8896a8] hover:text-[#e2e8f0]"
                }`}
              >
                <Hammer className="w-3.5 h-3.5 text-[#e5a93c]" />
                <span>Hideout</span>
                <span className="font-mono-tabular text-[10px] text-[#7f8ea1]">
                  {builtCount}/{allUpgrades.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setWorkspaceMode("tasks");
                  setMobileTab("tasks");
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11.5px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                  workspaceMode === "tasks"
                    ? "bg-[#141b26] text-[#f8fafc] shadow-sm ring-1 ring-white/[0.08]"
                    : "text-[#8896a8] hover:text-[#e2e8f0]"
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Tasks</span>
                <span className="font-mono-tabular text-[10px] text-[#7f8ea1]">
                  {completedTasksCount}/{factionTasks.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setWorkspaceMode("vendors");
                  setMobileTab("vendors");
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11.5px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                  workspaceMode === "vendors"
                    ? "bg-[#141b26] text-[#f8fafc] shadow-sm ring-1 ring-white/[0.08]"
                    : "text-[#8896a8] hover:text-[#e2e8f0]"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#34d399]" />
                <span>Vendors</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setWorkspaceMode("keys");
                  setMobileTab("keys");
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11.5px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                  workspaceMode === "keys"
                    ? "bg-[#141b26] text-[#f8fafc] shadow-sm ring-1 ring-white/[0.08]"
                    : "text-[#8896a8] hover:text-[#e2e8f0]"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-[#e5a93c]" />
                <span>Keys</span>
                <span className="font-mono-tabular text-[10px] text-[#7f8ea1]">
                  {ownedKeysCount}/{keysCatalog.length}
                </span>
              </button>
            </div>

            {workspaceMode === "vendors" || workspaceMode === "legal" ? (
              <button
                type="button"
                onClick={() => {
                  setWorkspaceMode("hideout");
                  setMobileTab("map");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#e2e8f0] hover:text-white border border-white/[0.1] hover:border-white/[0.2] bg-white/[0.04] hover:bg-white/[0.08] transition-colors shrink-0"
              >
                <MapIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Return to Map</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={toggleExpandPreset}
                title={
                  isWidePanel
                    ? "Snap to compact sidebar (or drag divider)"
                    : "Expand panel width (or drag divider)"
                }
                aria-label={isWidePanel ? "Compact panel" : "Expand panel"}
                className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-[#94a3b8] hover:text-white border border-white/[0.08] hover:border-white/[0.18] bg-white/[0.03] hover:bg-white/[0.07] transition-colors shrink-0"
              >
                {isWidePanel ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-[#e5a93c]" />
                    <span className="hidden 2xl:inline">Compact</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span className="hidden 2xl:inline">Expand</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Active Left Panel Content */}
          {workspaceMode === "hideout" ? (
            <HideoutTrackerPanel
              activeView={activeView}
              onViewChange={setActiveView}
              allUpgrades={allUpgrades}
              selectedUpgradeId={selectedUpgrade?.id || null}
              onSelectUpgrade={setSelectedUpgrade}
              builtUpgrades={builtUpgrades}
              onToggleBuilt={handleToggleBuilt}
              plannedUpgrades={plannedUpgrades}
              onTogglePlanned={handleTogglePlanned}
              stashCounts={stashCounts}
              onSetStashCount={handleSetStashCount}
              tickedMapMaterials={tickedMapMaterials}
              onToggleMapMaterial={handleToggleMapMaterial}
              selectedMaterialKey={inspectedMaterial?.key || null}
              onInspectMaterial={handleInspectMaterial}
              onInspectDisassemblyItem={handleInspectDisassemblyItem}
              onInspectApiRecord={handleInspectApiRecord}
              onArmPinDrop={handleArmPinDrop}
              catalog={catalog}
              disassemblyRecipes={disassemblyRecipes}
              apiCache={apiCache}
              isExpanded={isWidePanel}
            />
          ) : workspaceMode === "tasks" ? (
            <TasksTrackerPanel
              vendors={vendors}
              tasks={allTasks}
              selectedFaction={selectedFaction}
              completedTasks={completedTasks}
              onToggleTaskComplete={handleToggleTaskComplete}
              selectedTaskId={inspectedTask?.id || null}
              onLocateTaskOnMap={handleLocateTaskOnMap}
              isExpanded={isWidePanel}
              isLoadingApi={apiStatus.mode === "loading"}
            />
          ) : workspaceMode === "vendors" ? (
            <VendorShopPanel
              vendors={vendors}
              shopItems={vendorShopItems}
              isExpanded={isWidePanel}
              isLoadingApi={apiStatus.mode === "loading"}
            />
          ) : workspaceMode === "legal" ? (
            <LegalPrivacyPanel
              operatorProfiles={operatorProfiles}
              activeOperatorId={activeOperatorId}
              storageSummary={totalStorageSummary}
              onExportBackup={handleExportBackup}
              onRestoreBackup={handleRestoreBackup}
              onEraseAllData={handleEraseAllData}
            />
          ) : (
            <KeysDoorsPanel
              keysList={keysCatalog}
              selectedFaction={selectedFaction}
              ownedKeys={ownedKeys}
              onToggleOwnedKey={handleToggleOwnedKey}
              selectedKeyId={inspectedKey?.id || null}
              onLocateKeyOnMap={handleLocateKeyOnMap}
              isExpanded={isWidePanel}
              isLoadingApi={apiStatus.mode === "loading"}
            />
          )}
        </aside>

        {/* Fluid Draggable Split Divider (Desktop lg+, hidden when Vendors/Legal full-screen or Glance Mode is active) */}
        {workspaceMode !== "vendors" && workspaceMode !== "legal" && !glanceMode && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize left panel width"
            tabIndex={0}
            title="Drag left or right to resize panel · Double-click to toggle width"
            onPointerDown={handleSplitterPointerDown}
            onDoubleClick={toggleExpandPreset}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                setPanelWidth((w) => {
                  const next = clampPanelWidth(w - 32);
                  safeStorageSet(PANEL_WIDTH_KEY, next);
                  return next;
                });
              } else if (e.key === "ArrowRight") {
                setPanelWidth((w) => {
                  const next = clampPanelWidth(w + 32);
                  safeStorageSet(PANEL_WIDTH_KEY, next);
                  return next;
                });
              }
            }}
            className={`hidden lg:flex w-2 -ml-1 z-20 shrink-0 cursor-col-resize items-center justify-center group select-none focus:outline-none ${
              isDraggingSplitter ? "bg-[#e5a93c]/25" : "hover:bg-[#38bdf8]/15"
            }`}
          >
            <div
              className={`w-1 h-12 rounded-full flex items-center justify-center transition-colors ${
                isDraggingSplitter
                  ? "bg-[#e5a93c] text-[#090d12]"
                  : "bg-[#253040] text-[#7f8ea1] group-hover:bg-[#38bdf8] group-hover:text-[#090d12]"
              }`}
            >
              <GripVertical className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Right Tactical Map Panel (Stays mounted for Leaflet pan/zoom persistence; hidden in full-screen Vendors/Legal views unless Glance Mode) */}
        <div
          className={`${
            (workspaceMode === "vendors" || workspaceMode === "legal") && !glanceMode
              ? mobileTab === "map"
                ? "flex flex-1 min-h-0 lg:hidden"
                : "hidden"
              : glanceMode || mobileTab === "map"
                ? "flex flex-1 min-h-0"
                : "hidden lg:flex lg:flex-1 lg:min-h-0 lg:min-w-[280px]"
          }`}
        >
          <TacticalMapPanel
            catalog={catalog}
            customPins={customPins}
            onAddPin={handleAddPin}
            onUpdatePin={handleUpdatePin}
            onRemovePin={handleRemovePin}
            tickedMapMaterials={tickedMapMaterials}
            onToggleMapMaterial={handleToggleMapMaterial}
            inspectedMaterial={inspectedMaterial}
            inspectedLookup={inspectedLookup}
            isLookupLoading={isLookupLoading}
            onCloseInspect={() => setInspectedMaterial(null)}
            inspectedTask={inspectedTask}
            onCloseInspectTask={() => setInspectedTask(null)}
            onSelectTask={handleLocateTaskOnMap}
            allTasks={factionTasks}
            selectedFaction={selectedFaction}
            activeOperatorName={activeOperatorProfile.name}
            glanceMode={glanceMode}
            onToggleGlanceMode={handleToggleGlanceMode}
            keysList={keysCatalog}
            ownedKeys={ownedKeys}
            onToggleOwnedKey={handleToggleOwnedKey}
            inspectedKey={inspectedKey}
            onSelectKey={handleLocateKeyOnMap}
            onCloseInspectKey={() => setInspectedKey(null)}
            onSelectMaterial={handleInspectMaterial}
            completedTasks={completedTasks}
            onToggleTaskComplete={handleToggleTaskComplete}
            apiRecords={allApiRecords}
            pinDropMode={pinDropMode}
            onTogglePinDropMode={(force) =>
              setPinDropMode((prev) => (force !== undefined ? force : !prev))
            }
            preselectedPinMaterialId={preselectedPinMatId}
            onNotify={showToast}
            layoutTrigger={`${panelWidth}-${mobileTab}-${workspaceMode}-${glanceMode}`}
            isResizing={isDraggingSplitter}
          />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (< lg only, thumb-reachable 56px height, >= 44px hit targets) */}
      <nav
        aria-label="Mobile sections"
        className="lg:hidden h-14 shrink-0 border-t border-white/[0.075] bg-[#0a0e14]/96 backdrop-blur-lg grid grid-cols-6 z-30"
      >
        <button
          type="button"
          onClick={() => {
            setGlanceMode(false);
            setMobileTab("hideout");
            setWorkspaceMode("hideout");
          }}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] text-[10px] font-medium transition-colors ${
            mobileTab === "hideout"
              ? "text-[#e5a93c] bg-[#141b26]"
              : "text-[#8b98a9] hover:text-white"
          }`}
        >
          <Hammer className="w-4 h-4" />
          <span>Hideout</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setGlanceMode(false);
            setMobileTab("tasks");
            setWorkspaceMode("tasks");
          }}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] text-[10px] font-medium transition-colors ${
            mobileTab === "tasks"
              ? "text-[#38bdf8] bg-[#141b26]"
              : "text-[#8b98a9] hover:text-white"
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Tasks</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setGlanceMode(false);
            setMobileTab("vendors");
            setWorkspaceMode("vendors");
          }}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] text-[10px] font-medium transition-colors ${
            mobileTab === "vendors"
              ? "text-[#34d399] bg-[#141b26]"
              : "text-[#8b98a9] hover:text-white"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Vendors</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setGlanceMode(false);
            setMobileTab("keys");
            setWorkspaceMode("keys");
          }}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] text-[10px] font-medium transition-colors ${
            mobileTab === "keys"
              ? "text-[#e5a93c] bg-[#141b26]"
              : "text-[#8b98a9] hover:text-white"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Keys</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("map")}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] text-[10px] font-medium transition-colors ${
            mobileTab === "map"
              ? "text-[#38bdf8] bg-[#141b26]"
              : "text-[#8b98a9] hover:text-white"
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>Map</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setGlanceMode(false);
            setMobileTab("legal");
            setWorkspaceMode("legal");
          }}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] text-[10px] font-medium transition-colors ${
            mobileTab === "legal"
              ? "text-[#e5a93c] bg-[#141b26]"
              : "text-[#8b98a9] hover:text-white"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Legal</span>
        </button>
      </nav>

      {/* Subtle Action Toast */}
      {toast && (
        <div className="gzw-toast-enter fixed top-14 right-3 sm:right-4 z-[2000] pointer-events-none inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0e131b]/96 backdrop-blur-xl border border-[#e5a93c]/45 text-xs font-medium text-[#f1f5f9] shadow-2xl max-w-[calc(100vw-24px)] sm:max-w-sm text-left">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e5a93c] shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
