/**
 * Utilities for Geolocation and GPS coordinate conversion
 */

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  nsString: string; // e.g. "S 06° 12' 34.5\""
  eString: string;  // e.g. "E 106° 49' 12.3\""
  decimalString: string;
}

export function convertToDMS(deg: number, isLatitude: boolean): string {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);

  let direction = '';
  if (isLatitude) {
    direction = deg >= 0 ? 'N' : 'S';
  } else {
    direction = deg >= 0 ? 'E' : 'W';
  }

  return `${direction} ${degrees}° ${minutes}' ${seconds}"`;
}

export function getCurrentGpsPosition(): Promise<GpsCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation tidak didukung oleh peramban ini.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        resolve({
          latitude: lat,
          longitude: lng,
          nsString: convertToDMS(lat, true),
          eString: convertToDMS(lng, false),
          decimalString: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        });
      },
      (error) => {
        let msg = 'Gagal mengambil lokasi GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Izin lokasi GPS ditolak oleh pengguna.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Informasi lokasi tidak tersedia.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Waktu permintaan lokasi GPS habis.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
