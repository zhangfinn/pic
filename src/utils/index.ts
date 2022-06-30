export const afterLoad = (callback: any) => {
  if (document.readyState === 'complete') {
    setTimeout(callback)
  } else {
    window.addEventListener('pageshow', callback, { once: true, capture: true })
  }
}
