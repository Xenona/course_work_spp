export function createIconButton(icon: string): HTMLButtonElement {
  const btn = document.createElement('button')
  const iconEl = document.createElement('span')
  iconEl.classList.add('material-icons')
  iconEl.textContent = icon
  btn.append(iconEl)
  return btn
}

export function createCheckbox(
  label: string
): [HTMLInputElement, HTMLLabelElement] {
  const checkbox = document.createElement('input')
  const labelEl = document.createElement('label')
  labelEl.textContent = label
  checkbox.type = 'checkbox'

  return [checkbox, labelEl]
}
