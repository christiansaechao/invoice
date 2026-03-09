import { useUser } from "@/store/user.store";
import { Loader2 } from "lucide-react";

export function FromInfo() {
  const { profile } = useUser((state) => state);

  const {
    first_name,
    last_name,
    preferred_email,
    city,
    state,
    area_code,
    address,
    phone_number,
  } = profile ?? {};

  if (!profile) {
    return <Loader2 />;
  }

  return (
    <div className="card">
      <h2>From</h2>
      <div className="fromHeader">
        <div className="fromName capitalize">
          {first_name} {last_name}
        </div>
        <div className="fromMeta">
          <div className="toLine">{address}</div>
          <div className="toLine capitalize">
            {city} {state}, {area_code}
          </div>
          <div className="toLine toMuted">{phone_number}</div>
          <div className="toLine toMuted">{preferred_email}</div>
          <div className="toLine"></div>
        </div>
      </div>
    </div>
  );
}
