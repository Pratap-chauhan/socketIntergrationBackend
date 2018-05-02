export default function (total_items, current_items, per_page, current_page) {
  return {
    total_item: total_items,
    showing: current_items,
    first_page: 1,
    previous_page: (current_page + 1) === 1 ? 1 : current_page,
    current_page: current_page + 1,
    next_page: current_page + 2,
    last_page: Math.ceil(total_items/per_page)
  }
}