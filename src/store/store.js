import { configureStore } from '@reduxjs/toolkit'
import themeReducer     from './themeSlice'
import authReducer      from './authSlice'
import dashboardReducer from './dashboardSlice'
import inventoryReducer from './inventorySlice'
import categoryReducer  from './categorySlice'
import formulaReducer   from './formulaSlice'
import productionReducer from './productionSlice'
import customerReducer  from './customerSlice'
import orderReducer     from './orderSlice'
import settingReducer   from './settingSlice'

export const store = configureStore({
  reducer: {
    theme:     themeReducer,
    auth:      authReducer,
    dashboard: dashboardReducer,
    inventory: inventoryReducer,
    category:  categoryReducer,
    formula:   formulaReducer, 
    production: productionReducer,
    customer:  customerReducer,
    order:     orderReducer,
    setting:    settingReducer,
  },
})
export default store