
import { sub } from "date-fns";

// eslint-disable-next-line import/no-cycle
import { _descriptions, _heading, _id, _ratings } from "./_others";


export const _mock = {
  id: (index: number) => _id[index],
  time: (index: number) => sub(new Date(), { days: index, hours: index }),
  heading: (index: number) => _heading[index],
  description: (index: number) => _descriptions[index],
  number: {
    rating: (index: number) => _ratings[index],
  },
};
