import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://pqoyhzlrvvsfkfzduaot.supabase.co"
const supabaseKey = "sb_publishable_LV9jemSYTw5wWRRytnCkjg_ng7wzTEz"

export const supabase = createClient(supabaseUrl, supabaseKey)



/* ----------------------------
   PRODUCTS
----------------------------- */

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)

  if (error) {
    console.error("Products fetch error:", error)
    return []
  }

  return data
}



/* ----------------------------
   CATEGORIES
----------------------------- */

export async function getCategories() {
  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("active", true)

  if (error) {
    console.error("Category fetch error:", error)
    return []
  }

  const categories = [...new Set(data.map(p => p.category))]

  return ["الكل", ...categories]
}



/* ----------------------------
   SUBCATEGORIES
----------------------------- */

export async function getSubcategories(category) {

  if (!category || category === "الكل") return []

  const { data, error } = await supabase
    .from("products")
    .select("subcategory")
    .eq("category", category)
    .eq("active", true)

  if (error) {
    console.error("Subcategory fetch error:", error)
    return []
  }

  const subcategories = [...new Set(data.map(p => p.subcategory))]

  return ["الكل", ...subcategories]
}


/* ----------------------------
    AUTH (داخل ملف الـ API بتاعك)
----------------------------- */

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) console.error("Error logging out:", error.message)
}

/* ----------------------------
   IMAGE UPLOAD
----------------------------- */

export async function uploadProductImage(file) {

  const fileExt = file.name.split(".").pop()

  const fileName = `products/${crypto.randomUUID()}.${fileExt}`

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file)

  if (error) {
    console.error("Image upload error:", error)
    throw error
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName)

  return data.publicUrl
}

/* ----------------------------
   ADMIN PRODUCTS
----------------------------- */

export async function getAdminProducts(page = 1, limit = 20) {

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Admin products fetch error:", error)
    return { products: [], count: 0 }
  }

  return { products: data, count }
}

/* ----------------------------
   CREATE PRODUCT
----------------------------- */

export async function createProduct(product) {

  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()

  if (error) throw error

  return data[0]
}


/* ----------------------------
   UPDATE PRODUCT
----------------------------- */

export async function updateProduct(id, updates) {

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()

  if (error) throw error

  return data[0]
}


/* ----------------------------
   DELETE PRODUCT
----------------------------- */

export async function deleteProduct(id) {

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)

  if (error) throw error

}