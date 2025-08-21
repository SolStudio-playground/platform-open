// eslint-disable-next-line import/no-cycle
import { _mock } from './_mock';

export const _ratings = [
  4.2, 3.7, 4.5, 3.5, 0.5, 3.0, 2.5, 2.8, 4.9, 3.6, 2.5, 1.7, 3.9, 2.8, 4.1, 4.5, 2.2, 3.2, 0.6,
  1.3, 3.8, 3.8, 3.8, 2.0,
];

export const _id = [...Array(40)].map(
  (_, index) => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index + 1}`
);

export const _heading = [
  `What is Solstudio?`,
  `What are the benefits of using Solstudio?`,
  `How much does it cost to create a Solana token on Solstudio?`,
  `What kind of tokens can I create on Solstudio?`,
  `Why should I use Solstudio for my token creation?`,
  `Can I create a Solana token without coding knowledge?`,
  `Who can use Solstudio?`,
];

export const _descriptions = [
  `Solstudio is a user-friendly platform that allows you to create Solana tokens quickly and easily. With Solstudio, you can create your token without any coding knowledge, making it perfect for anyone who wants to launch a token.`,
  `Solstudio has a range of features that make it the perfect choice for token creation and management. It's fast, affordable, and user-friendly, making it the ideal platform for anyone who wants to create a token.`,
  `Creating your token is super affordable, at only 0.20 SOL, which includes all you need for token issuance and util.`,
  `You can create a wide range of tokens on Solstudio, including meme tokens, utility tokens, security tokens, and more. Whatever your token idea, Solstudio can help you bring it to life.`,
  `Solstudio simplifies the process with an intuitive interface, no coding required. It offers advanced management tools, prioritizes security, and stands out as the most cost-effective platform for creating and managing your Solana tokens.`,
  `All you need is a token idea and a Solana wallet. We handle the technical stuff, so you don't have to worry.`,
  `Solstudio is designed for anyone who wants to create a token on Solana, whether you're an individual, a business, or a developer. It's perfect for launching tokens quickly and easily, without the need for coding knowledge.`,
];

export const _faqs = [...Array(7)].map((_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  heading: _mock.heading(index),
  detail: _mock.description(index),
}));

export const _testimonials = [
  {
    postedDate: _mock.time(1),
    ratingNumber: _mock.number.rating(2),
    title: `token creation made simple and affordable`,
    content: `I was amazed at how simple and affordable it is to launch a token with Solstudio. It's definitely the most budget-friendly option out there for token creators.`,
  },
  {
    title: `Game Changer for Indie Devs`,
    postedDate: _mock.time(2),
    ratingNumber: _mock.number.rating(2),
    content: `Using Solstudio was a game changer for my small project. The platform's simplicity allowed me to launch my token without hiring a dev team.`,
  },
  {
    title: `Effortless Token Launching Experience`,
    postedDate: _mock.time(3),
    ratingNumber: _mock.number.rating(2),
    content: `The simplicity of Solstudio is amazing. You come, make your token, and that's it. It's perfect for launching lots of tokens fast and without hassle.`,
  },
  {
    title: `Affordable and easy token Launch`,
    postedDate: _mock.time(4),
    ratingNumber: _mock.number.rating(2),
    content: `I keep using Solstudio because it's just so simple and cheaper than others. It's perfect for anyone who wants to launch tokens without knowing code.`,
  },
  {
    title: `User-Friendly Token Creation Tool`,
    postedDate: _mock.time(5),
    ratingNumber: _mock.number.rating(2),
    content: `What I love about Solstudio is that it's super user-friendly. Even if you're new to this, you can easily create your token and get going in no time.`,
  },
  {
    title: `Yo, that was easy!`,
    postedDate: _mock.time(6),
    ratingNumber: _mock.number.rating(2),
    content: `Just popped my token out on solstudio.so like it was nothing. Thought it'd be a brain buster but nah, smooth sailing.`,
  },
  {
    title: `Effortless Token Launching`,
    postedDate: _mock.time(6),
    ratingNumber: _mock.number.rating(2),
    content: `Using Solstudio is a breeze. It’s my go-to for making tokens on Solana because it’s fast, straightforward, and doesn’t cost a lot.),`,
  },
];
