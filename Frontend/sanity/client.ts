import { createClient } from "next-sanity";

export const projectId = "jy06mayv"; // Senin Sanity Proje ID'n
export const dataset = "production";
const apiVersion = "2023-05-03"; // Bu tarihi değiştirmene gerek yok

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    enabled: false,
  },
});
