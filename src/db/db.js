import Dexie from 'dexie'

export const db = new Dexie('rezeptsammlung')

db.version(1).stores({
  recipes:       '++id, title',
  ingredients:   '++id, recipe_id',
  steps:         '++id, recipe_id',
  labels:        '++id, name',
  recipe_labels: '[recipe_id+label_id], recipe_id, label_id',
})
