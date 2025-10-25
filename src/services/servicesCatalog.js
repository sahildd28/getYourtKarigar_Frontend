const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081";

const DEFAULT_FETCH_OPTIONS = {
  headers: { Accept: "application/json" },
};

function shuffleArray(items) {
  const list = Array.isArray(items) ? [...items] : [];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export async function fetchServiceCategories() {
  const res = await fetch(
    `${API_BASE}/services/categories`,
    DEFAULT_FETCH_OPTIONS
  );

  if (!res.ok) {
    throw new Error(`Failed to load service categories (${res.status})`);
  }

  return res.json();
}

export async function fetchWorksByCategoryId(categoryId) {
  if (!categoryId) throw new Error("categoryId is required");
  const res = await fetch(
    `${API_BASE}/services/categories/${encodeURIComponent(categoryId)}/works`,
    DEFAULT_FETCH_OPTIONS
  );

  if (!res.ok) {
    throw new Error(
      `Failed to load works for category ${categoryId} (${res.status})`
    );
  }

  return res.json();
}

export async function fetchAllServiceWorks({
  categories,
  limit,
  perCategoryLimit = 6,
  shuffle = true,
} = {}) {
  const sourceCategories =
    Array.isArray(categories) && categories.length
      ? categories
      : await fetchServiceCategories();

  if (!Array.isArray(sourceCategories) || !sourceCategories.length) {
    return [];
  }

  const workLists = await Promise.all(
    sourceCategories.map(async (category) => {
      try {
        const works = await fetchWorksByCategoryId(category.id);
        if (!Array.isArray(works) || !works.length) {
          return [];
        }
        const limited =
          perCategoryLimit > 0 ? works.slice(0, perCategoryLimit) : works;
        return limited.map((work) => ({
          ...work,
          categoryId: category.id,
          categoryName: category.name,
        }));
      } catch (err) {
        console.warn(`Failed to load works for category ${category?.id}`, err);
        return [];
      }
    })
  );

  let flattened = workLists.flat().filter(Boolean);

  if (!flattened.length) {
    return flattened;
  }

  if (shuffle) {
    flattened = shuffleArray(flattened);
  }

  if (limit && limit > 0) {
    flattened = flattened.slice(0, limit);
  }

  return flattened;
}
