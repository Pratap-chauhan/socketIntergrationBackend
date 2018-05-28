export default function (total_items, current_items, per_page, current_page) {
  total_items = Number(total_items);
  current_items = Number(current_items);
  per_page = Number(per_page);
  current_page = Number(current_page);

  return {
    total_item: total_items,
    showing: current_items,
    first_page: 1,
    previous_page: (current_page - 1) < 2 ? 1 : (current_page - 1),
    current_page: current_page,
    next_page: current_page + 1,
    last_page: Math.ceil(total_items/per_page)
  }
}