export type ButtonPayload = {
  action: "single" | "double" | "long";
};

export type MotionPayload = {
  occupancy: boolean;
};
export interface DeviceConfig {
  topic: string;
}

// export default as RGBLight
