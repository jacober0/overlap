export type Diet = 'omnivor' | 'vegetarisch' | 'vegan'
export type Allergen = 'gluten' | 'krebstiere' | 'ei' | 'fisch' | 'erdnuss' | 'soja' | 'milch' | 'schalenfruechte' | 'sellerie' | 'senf' | 'sesam' | 'sulfite' | 'lupine' | 'weichtiere'
export type Category = 'Gemüse' | 'Obst' | 'Trockenwaren' | 'Kühlregal' | 'Fleisch' | 'Gewürze' | 'Backwaren'

export interface Nutrition { kcal: number; protein: number; carbs: number; fat: number; fiber: number }
export interface Ingredient { id: string; name: string; amount: number; unit: string; category: Category; estimatedCost: number; allergens?: Allergen[] }
export interface Recipe {
  id: string; title: string; description: string; image: string; minutes: number; activeMinutes: number;
  servings: number; pricePerServing: number; difficulty: 'Einfach' | 'Mittel'; diet: Diet; tags: string[];
  nutrition: Nutrition; ingredients: Ingredient[]; steps: string[]
}
export interface Preferences {
  diet: Diet; maxMinutes: number; budgetFocus: number; variety: number; anchorTags: string[];
  allergens: Allergen[]; excludedIngredients: string[]; pantryIngredients: string[]; servings: number; targetMeals: number
}
export interface ScoreBreakdown { overlap: number; anchorMatch: number; costFit: number; diversity: number; newIngredientPenalty: number }
export interface RankedRecipe { recipe: Recipe; total: number; breakdown: ScoreBreakdown; reasons: string[] }
export interface ShoppingItem extends Ingredient { recipes: string[]; checked: boolean }
