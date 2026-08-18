import { API_URL } from "../../api"

export async function openSavedDataFileLocation() {
  console.log("opening saved data location...")
  const requestOption: RequestInit = { 
    method: "POST",
  }

  if (import.meta.env.DEV) {
    requestOption.body = "where's my tracker saved data file location?"
  }

  const response = await fetch(`${API_URL}/teleporter/saved_data_hideout_path`, requestOption)
  
  if (import.meta.env.DEV) {
    console.log(await response.text())
  }
}