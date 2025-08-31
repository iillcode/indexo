export interface TutorialContent {
  [key: string]: string;
}

export const tutorialContent: TutorialContent = {
  "aspect-ratio": `# Aspect Ratio

The \`aspect-ratio\` utilities are used to constrain an element to specific aspect ratios.

## Basic Usage

Use the aspect ratio utilities to set the desired aspect ratio of an element.
- \`/app/src/app/components/aspect-ratio.tsx\`
\`\`\`html
<iframe class="w-full aspect-video ..." src="https://www.youtube.com/..."></iframe>
\`\`\`
- You can also use the \`aspect-{ratio}\` utilities to set the desired aspect ratio of an element. \n\n
## Arbitrary values

If you need to use a one-off aspect ratio value that doesn't make sense to include in your theme, use square brackets to generate a property on the fly using any arbitrary value.

\`\`\`html
<iframe class="w-full aspect-[4/3] ..." src="https://www.youtube.com/..."></iframe>
\`\`\`

## Responsive Design

To control the aspect ratio of an element at a specific breakpoint, add a \`{screen}:\` prefix to any existing aspect ratio utility.

\`\`\`html
<iframe class="w-full aspect-video md:aspect-square ..." src="https://www.youtube.com/..."></iframe>
\`\`\`

## Customizing your theme

By default, Tailwind provides a minimal set of aspect-ratio utilities:

\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
      }
    }
  }
}
\`\`\``,

  container: `# Container

A component for fixing an element's width to the current breakpoint.

## Basic Usage

The \`container\` class sets the \`max-width\` of an element to match the \`min-width\` of the current breakpoint. This is useful if you'd prefer to design for a fixed set of screen sizes instead of trying to accommodate a fully fluid viewport.

\`\`\`html
<div class="container mx-auto">
  <!-- ... -->
</div>
\`\`\`

## Centering by default

To center containers by default, set the \`center\` option to \`true\` in the \`container\` configuration:

\`\`\`javascript
module.exports = {
  theme: {
    container: {
      center: true,
    },
  },
}
\`\`\`

## Adding horizontal padding

To add horizontal padding by default, specify the amount of padding you'd like using the \`padding\` option:

\`\`\`javascript
module.exports = {
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
  },
}
\`\`\``,

  columns: `# Columns

Utilities for controlling the number of columns within an element.

## Basic Usage

Use the \`columns-{count}\` utilities to set the number of columns that should be created for the content within an element. The column width will be automatically calculated based on the number of columns.

\`\`\`html
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p>Sure, go ahead, laugh...</p>
  <p>Burn her anyway!</p>
</div>
\`\`\`

You can also use \`columns-{width}\` utilities to set the ideal column width for the content, with the number of columns (the count) automatically adjusting to accommodate that value:

\`\`\`html
<div class="columns-3xs">
  <p>Well, let me tell you something, ...</p>
  <p>Sure, go ahead, laugh...</p>
  <p>Burn her anyway!</p>
</div>
\`\`\`

## Setting the column gap

To specify the width between columns, you can use the \`gap-x\` utilities:

\`\`\`html
<div class="columns-3 gap-8">
  <p>Well, let me tell you something, ...</p>
  <p>Sure, go ahead, laugh...</p>
  <p>Burn her anyway!</p>
</div>
\`\`\`

## Responsive Design

To control the columns of an element at a specific breakpoint, add a \`{screen}:\` prefix to any existing columns utility.

\`\`\`html
<div class="columns-1 md:columns-3">
  <p>Well, let me tell you something, ...</p>
  <p>Sure, go ahead, laugh...</p>
  <p>Burn her anyway!</p>
</div>
\`\`\``,

  "break-after": `# Break After

Utilities for controlling how a column or page should break after an element.

## Basic Usage

Use \`break-after-auto\` to allow page and column breaks to be automatically calculated:

\`\`\`html
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-after-column">Sure, go ahead, laugh if you will...</p>
  <p>Burn her anyway!</p>
</div>
\`\`\`

Use \`break-after-avoid\` to avoid page and column breaks after an element:

\`\`\`html
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-after-avoid">Sure, go ahead, laugh if you will...</p>
  <p>Burn her anyway!</p>
</div>
\`\`\`

Use \`break-after-all\` to force page and column breaks after an element:

\`\`\`html
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-after-all">Sure, go ahead, laugh if you will...</p>
  <p>Burn her anyway!</p>
</div>
\`\`\``,

  "break-before": `# Break Before

Utilities for controlling how a column or page should break before an element.

## Basic Usage

Use \`break-before-auto\` to allow page and column breaks to be automatically calculated:

\`\`\`html
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-before-column">Sure, go ahead, laugh if you will...</p>
  <p>Burn her anyway!</p>
</div>
\`\`\`

Use \`break-before-avoid\` to avoid page and column breaks before an element:

\`\`\`html
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-before-avoid">Sure, go ahead, laugh if you will...</p>
  <p>Burn her anyway!</p>
</div>
\`\`\`

Use \`break-before-all\` to force page and column breaks before an element:

\`\`\`html
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-before-all">Sure, go ahead, laugh if you will...</p>
  <p>Burn her anyway!</p>
</div>
\`\`\``,

  "flex-direction": `# Flex Direction

Utilities for controlling the direction of flex items.

## Row

Use \`flex-row\` to position flex items horizontally in the same direction as text:

\`\`\`html
<div class="flex flex-row ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
\`\`\`

## Row reversed

Use \`flex-row-reverse\` to position flex items horizontally in the opposite direction:

\`\`\`html
<div class="flex flex-row-reverse ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
\`\`\`

## Column

Use \`flex-col\` to position flex items vertically:

\`\`\`html
<div class="flex flex-col ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
\`\`\`

## Column reversed

Use \`flex-col-reverse\` to position flex items vertically in the opposite direction:

\`\`\`html
<div class="flex flex-col-reverse ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
\`\`\`

## Responsive Design

To control the flex direction of an element at a specific breakpoint, add a \`{screen}:\` prefix to any existing flex direction utility.

\`\`\`html
<div class="flex flex-col md:flex-row">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
\`\`\``,

  width: `# Width

Utilities for setting the width of an element.

## Fixed widths

Use utilities like \`w-96\`, \`w-64\`, and \`w-48\` to set an element to a fixed width.

\`\`\`html
<div class="w-96 ..."></div>
<div class="w-80 ..."></div>
<div class="w-72 ..."></div>
<div class="w-64 ..."></div>
<div class="w-60 ..."></div>
<div class="w-56 ..."></div>
<div class="w-52 ..."></div>
<div class="w-48 ..."></div>
\`\`\`

## Fluid widths

Use \`w-{fraction}\` or \`w-full\` to set an element to a percentage based width.

\`\`\`html
<div class="flex ...">
  <div class="w-1/2 ... ">w-1/2</div>
  <div class="w-1/2 ... ">w-1/2</div>
</div>
<div class="flex ...">
  <div class="w-2/5 ...">w-2/5</div>
  <div class="w-3/5 ...">w-3/5</div>
</div>
<div class="w-1/3 ...">w-1/3</div>
<div class="w-2/3 ...">w-2/3</div>
<div class="w-1/4 ...">w-1/4</div>
<div class="w-3/4 ...">w-3/4</div>
<div class="w-1/5 ...">w-1/5</div>
<div class="w-2/5 ...">w-2/5</div>
<div class="w-3/5 ...">w-3/5</div>
<div class="w-4/5 ...">w-4/5</div>
<div class="w-1/6 ...">w-1/6</div>
<div class="w-5/6 ...">w-5/6</div>
<div class="w-full ...">w-full</div>
\`\`\``,

  height: `# Height

Utilities for setting the height of an element.

## Fixed heights

Use utilities like \`h-96\`, \`h-64\`, and \`h-48\` to set an element to a fixed height.

\`\`\`html
<div class="h-96 ..."></div>
<div class="h-80 ..."></div>
<div class="h-72 ..."></div>
<div class="h-64 ..."></div>
<div class="h-60 ..."></div>
<div class="h-56 ..."></div>
<div class="h-52 ..."></div>
<div class="h-48 ..."></div>
\`\`\`

## Full height

Use \`h-screen\` to make an element span the entire height of the viewport.

\`\`\`html
<div class="h-screen">
  <!-- This div will be the full height of the screen -->
</div>
\`\`\`

## Dynamic heights

Use \`h-auto\` to let the browser determine the height for the element.

\`\`\`html
<div class="h-auto ...">
  <!-- Height will be determined by the content -->
</div>
\`\`\``,

  "font-size": `# Font Size

Utilities for controlling the font size of an element.

## Usage

Control the font size of an element using the \`text-{size}\` utilities.

\`\`\`html
<p class="text-sm ...">The quick brown fox ...</p>
<p class="text-base ...">The quick brown fox ...</p>
<p class="text-lg ...">The quick brown fox ...</p>
<p class="text-xl ...">The quick brown fox ...</p>
<p class="text-2xl ...">The quick brown fox ...</p>
<p class="text-3xl ...">The quick brown fox ...</p>
<p class="text-4xl ...">The quick brown fox ...</p>
<p class="text-5xl ...">The quick brown fox ...</p>
<p class="text-6xl ...">The quick brown fox ...</p>
\`\`\`

## Responsive Design

To control the font size of an element at a specific breakpoint, add a \`{screen}:\` prefix to any existing font size utility.

\`\`\`html
<p class="text-base md:text-lg lg:text-xl">
  The quick brown fox jumps over the lazy dog.
</p>
\`\`\`

## Arbitrary values

If you need to use a one-off font size value that doesn't make sense to include in your theme, use square brackets to generate a property on the fly using any arbitrary value.

\`\`\`html
<p class="text-[14px]">
  The quick brown fox jumps over the lazy dog.
</p>
\`\`\``,
};
