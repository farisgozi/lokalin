import { Account, Client, Databases, Storage } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

const hasAppwriteConfig = Boolean(endpoint && projectId);

export const appwriteClient = hasAppwriteConfig
  ? new Client().setEndpoint(endpoint!).setProject(projectId!)
  : null;

export const account = appwriteClient ? new Account(appwriteClient) : null;
export const databases = appwriteClient ? new Databases(appwriteClient) : null;
export const storage = appwriteClient ? new Storage(appwriteClient) : null;

export function assertAppwriteConfigured() {
  if (!hasAppwriteConfig || !account) {
    throw new Error(
      "Appwrite belum dikonfigurasi. Isi NEXT_PUBLIC_APPWRITE_ENDPOINT dan NEXT_PUBLIC_APPWRITE_PROJECT_ID di file .env.local"
    );
  }
}
