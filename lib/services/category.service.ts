import { prisma } from '@/lib/db'

export async function getCategoriesService() {
  try {
    const allCategories = await prisma.kategori.findMany({
      orderBy: { sira: 'asc' },
    })

    // Build the tree
    const categoryMap = new Map<number, any>()
    const tree: any[] = []

    // First pass: map them all
    allCategories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, altKategoriler: [] })
    })

    // Second pass: attach children to parents
    allCategories.forEach(cat => {
      const node = categoryMap.get(cat.id)
      if (cat.ustKategoriId) {
        const parent = categoryMap.get(cat.ustKategoriId)
        if (parent) {
          parent.altKategoriler.push(node)
        }
      } else {
        tree.push(node)
      }
    })

    return tree
  } catch (error: any) {
    console.error(`[CATEGORY_SERVICE_ERROR_1001] getCategoriesService failed: ${error.message}`)
    return []
  }
}
