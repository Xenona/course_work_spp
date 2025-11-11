export function createIconButton(icon: string): HTMLButtonElement {
  const btn = document.createElement('button')
  const iconEl = document.createElement('span')
  iconEl.classList.add('material-icons')
  iconEl.textContent = icon
  btn.append(iconEl)
  return btn
}
