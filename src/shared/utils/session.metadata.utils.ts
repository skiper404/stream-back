import DeviceDetector from 'device-detector-js'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import { SessionMetadata } from '../types/session-metadata.types'

countries.registerLocale(enLocale)

export async function getSessionMetadata(userAgent: string): Promise<SessionMetadata> {
  const res = await fetch('https://ipapi.co/json/?token=6Dc4dqe6KBEsP1NXpTXjRZ6Cv1Ut3SvX1rJY2gbDrNAfJOtSOs')
  const data = await res.json()

  const device = new DeviceDetector().parse(userAgent)

  return {
    location: { country: data.country_name, city: data.city },
    device: { browser: device.client?.type ?? 'Unknown', os: device.os?.name ?? 'Unknown' },
    ip: data.ip
  }
}
