import { useState, useEffect } from 'react'
import Select from 'react-select'
import carddbData from './cardb/carddb.json'

const SelectorCar = () => {
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedModel, setSelectedModel] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)

  const supplierOptions = carddbData.map((item) => ({
    label: item.marca,
    value: item.marca,
  }))

  const filterModelsByBrand = (brand) => {
    const brandData = carddbData.find((item) => item.marca === brand)
    if (!brandData || !brandData.model) {
      console.error('No models found for brand', brand)
      return []
    }
    return Object.entries(brandData.model)
      .filter(([_, model]) => model && typeof model === 'object')
      .map(([key, value]) => ({
        label: `${brand} ${key}`,
        value: `${brand}-${key}`,
      }))
  }

  const filterYearsByModel = (modelValue) => {
    const [brand, modelName] = modelValue.split('-')
    const modelData = carddbData.find(
      (item) => item.marca === brand && item.model && item.model[modelName]
    )

    if (!modelData || !modelData.year) {
      console.error('No years found for model', modelValue)
      return []
    }

    if (!modelData.year[modelName]) {
      return []
    }

    const validYears = Object.keys(modelData.year[modelName]).filter(
      (key) => Object.keys(modelData.year[modelName][key]).length > 0
    )

    return validYears.map((year) => ({
      label: year,
      value: year,
    }))
  }

  useEffect(() => {
    if (selectedBrand) {
      const filteredModels = filterModelsByBrand(selectedBrand)
      if (filteredModels.length > 0) {
        setSelectedModel(filteredModels[0].value)
      }
    }
  }, [selectedBrand])

  useEffect(() => {
    if (selectedModel) {
      const filteredYears = filterYearsByModel(selectedModel)
      if (filteredYears.length > 0) {
        setSelectedYear(filteredYears[0].value)
      }
    }
  }, [selectedModel])

  const handleBrandChange = (option) => {
    setSelectedBrand(option.value)
    setSelectedModel(null)
    setSelectedYear(null)
  }

  const handleModelChange = (option) => {
    setSelectedModel(option.value)
  }

  const handleYearChange = (option) => {
    setSelectedYear(option.value)
  }

  return (
    <div>
      <Select options={supplierOptions} onChange={handleBrandChange} />
      <Select
        options={selectedBrand ? filterModelsByBrand(selectedBrand) : []}
        onChange={handleModelChange}
      />
      <Select
        options={selectedModel ? filterYearsByModel(selectedModel) : []}
        onChange={handleYearChange}
      />
    </div>
  )
}

export default SelectorCar
