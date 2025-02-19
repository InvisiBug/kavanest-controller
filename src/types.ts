export type ButtonPayload = {
  action: "single" | "double" | "long";
};

export type MotionPayload = {
  occupancy: boolean;
};
export interface DeviceConfig {
  topic: string;
}

export type RoomData = {
  setpoints: {
    weekend: Record<string, string>;
    weekday: Record<string, string>;
  };
  demand: number | null;
  overrideTime: number | null;
  overrideType: string | null;
  disabled: boolean | null;
  deadzone: number | null;
};
