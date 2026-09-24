import React, { useState, useEffect } from 'react'

interface QuantityControlProps {
  quantity: number
  onChange: (quantity: number) => void
  onIncrement: () => void
  onDecrement: () => void
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onChange,
  onIncrement,
  onDecrement,
}) => {
  const [inputValue, setInputValue] = useState<string>(String(quantity))

  useEffect(() => {
    setInputValue(String(quantity))
  }, [quantity])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    const num = parseInt(val, 10)
    if (!isNaN(num) && num >= 0) {
      onChange(num)
    } else if (val === '') {
      onChange(0)
    }
  }

  const handleBlur = () => {
    const num = parseInt(inputValue, 10)
    if (isNaN(num) || num < 0) {
      setInputValue('0')
      onChange(0)
    } else {
      setInputValue(String(num))
    }
  }

  return (
    <div
      className="quantity-control"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="qty-btn qty-minus"
        onClick={onDecrement}
        disabled={quantity <= 0}
        aria-label="수량 감소"
        title="수량 감소"
      >
        -
      </button>

      <input
        type="number"
        min="0"
        max="999"
        className="qty-input"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        aria-label="보유 수량"
      />

      <button
        type="button"
        className="qty-btn qty-plus"
        onClick={onIncrement}
        aria-label="수량 증가"
        title="수량 증가"
      >
        +
      </button>
    </div>
  )
}
