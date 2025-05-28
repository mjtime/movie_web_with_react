// .storybook/preview.js
// 최신 권장 방식 (Storybook 8+)
import { initialize, mswLoader } from "msw-storybook-addon";
import { handlers } from "../src/mocks/handlers";

initialize();

const preview = {
  parameters: {
    msw: {
      handlers,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader],
};

export default preview;
