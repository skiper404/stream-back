export interface LocationInfo {
  country: string
  city: string
}

export interface DeviceInfo {
  browser: string
  os: string
}

export interface SessionMetadata {
  location: LocationInfo
  device: DeviceInfo
  ip: string
}
