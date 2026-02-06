import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemas";
import { apiVersion, dataset, projectId } from "@/sanity/env";

const singletonTypes = new Set(["siteSettings"]);

export default defineConfig({
  name: "bliss-brand",
  title: "BLISS brand",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Панель управления")
          .items([
            S.listItem()
              .title("Товары")
              .schemaType("product")
              .child(S.documentTypeList("product").title("Все товары")),
            S.divider(),
            S.listItem()
              .title("Страницы")
              .schemaType("page")
              .child(S.documentTypeList("page").title("Все страницы")),
            S.divider(),
            S.listItem()
              .title("Настройки сайта")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Настройки сайта")
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action && ["publish", "discardChanges", "restore"].includes(action)
          )
        : input,
  },
});
