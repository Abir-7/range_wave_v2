export interface ICertificate {
  institutionName: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  link?: string; // optional
}

export interface IMechanicWorkshop {
  workshop_name: string;
  start_time: string; // "HH:mm"
  end_time: string; // "HH:mm"
  services: string[];
  location_name: string;
  place_id?: string;
  coordinates: [number, number]; // [longitude, latitude]
  experiences?: string[];
  certificates?: ICertificate[];
}

export interface IMechanicProfile {
  full_name?: string;
  mobile: string;
}

export interface IMechanicWorkshopPayload {
  workshop: IMechanicWorkshop;
  profile: IMechanicProfile;
}
