import { useEffect, useState } from "react";
import {
  Cpu,
  Crosshair,
  FileText,
  FlaskConical,
  KeyRound,
  Package,
  Pill,
  Shield,
  Wrench,
} from "lucide-react";
import { resolveTacticalImageUrl } from "../utils/imageUtils";

interface ItemThumbnailProps {
  src: string | null | undefined;
  alt: string;
  sizeClass?: string;
  kindHint?: string;
}

function renderTacticalFallbackIcon(label: string, kindHint?: string) {
  const txt = `${label} ${kindHint || ""}`.toLowerCase();
  if (/\bkey|keycard|passcard/.test(txt)) {
    return <KeyRound className="w-4 h-4 text-[#e5a93c]/80" />;
  }
  if (/\brifle|carbine|pistol|smg|shotgun|barrel|receiver|muzzle|suppressor|sight|optic|handguard|foregrip|laser|flashlight|stock|magazine|gun\b/.test(txt)) {
    return <Crosshair className="w-4 h-4 text-[#38bdf8]/80" />;
  }
  if (/\bcpu|motherboard|ram|circuit|gpu|graphics|processor|sensor|oscilloscope|radio|satcom|radar|jammer|electronic|fpga|asic|converter/.test(txt)) {
    return <Cpu className="w-4 h-4 text-[#38bdf8]/80" />;
  }
  if (/\bchem|lab|flask|pipette|electrode|canister|biohazard|plutonium|sarin|nerve|isotope|reagent|hepa|crystal/.test(txt)) {
    return <FlaskConical className="w-4 h-4 text-[#34d399]/80" />;
  }
  if (/\barmor|plate|helmet|rig|vest|nvg|goggles|mask|glasses/.test(txt)) {
    return <Shield className="w-4 h-4 text-[#38bdf8]/80" />;
  }
  if (/\bmed|morphine|ifak|bandage|splint|tourniquet|blood|surgical|injector|stim/.test(txt)) {
    return <Pill className="w-4 h-4 text-[#34d399]/80" />;
  }
  if (/\bintel|manifest|logs|drive|document|dossier|folder|report|laptop|usb/.test(txt)) {
    return <FileText className="w-4 h-4 text-[#e5a93c]/80" />;
  }
  if (/\btool|wrench|drill|coolant|pump|dynamo|steel|metal|copper|plumbing|mechanical|sealant|oil/.test(txt)) {
    return <Wrench className="w-4 h-4 text-[#cbd5e1]/75" />;
  }
  return <Package className="w-4 h-4 text-[#64748b]" />;
}

export function ItemThumbnail({
  src,
  alt,
  sizeClass = "w-9 h-9",
  kindHint,
}: ItemThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = resolveTacticalImageUrl(src, alt);

  useEffect(() => {
    setFailed(false);
  }, [resolvedSrc]);

  if (!resolvedSrc || failed) {
    return (
      <div
        className={`${sizeClass} shrink-0 rounded-lg bg-[#0a0e14] border border-white/[0.08] flex items-center justify-center`}
        aria-hidden="true"
      >
        {renderTacticalFallbackIcon(alt, kindHint)}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} shrink-0 rounded-lg bg-[#0a0e14] border border-white/[0.08] flex items-center justify-center overflow-hidden p-1`}
    >
      <img
        src={resolvedSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
