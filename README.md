## Grant Status Project

## Getting Started

After cloning, open two terminals and run the following commands in the root of the project

To start the GraphQL server

```bash
npx json-graphql-server db.js --port 8080
```

Other to start the project Next

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

After all, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Design Decisions, Assumptions, and Known Limitations

### **Design**

Before building the project, I took the time to research the latest design systems that the community has been focusing on. I consulted with colleagues, explored community resources like Rocketseat, and after analyzing the benefits, I decided to use **shadcn/ui** components, even though I wasn’t familiar with them beforehand. Instead of simply installing a design library, we copied the components into the project, giving us full flexibility to customize them as needed.

> **Note**: _shadcn/ui_ is a library of pre-styled components built with **TailwindCSS**. These components are built on top of other popular libraries like **Radix**, **Command Key**, and **ReactDatePicker**.

---

### **State Management**

For global state management, I chose **Zustand**. While I have experience with **Redux** and **Context API**, I opted for Zustand because its extreme simplicity to setup and easy to use.

---

### **Architecture**

It’s crucial for the code to have a clear separation of responsibilities. To achieve this, I focused on three key principles:

1. **Global State Management**: All global state logic is handled exclusively in the `/store` directory.
2. **Component Logic**: Components (`.tsx` files) are kept as lean as possible, with minimal logic. Instead, logic is delegated to custom hooks within their respective modules, allowing components to focus solely on rendering the UI.
3. **Custom Hooks**: I created custom hooks for each module to handle logic and provide functionality. For example:
   - `useGrant` for grant-related logic.
   - `useStatistics` for statistics-related logic.

---

#### **Known Limitations**

1. **Activity Feed Update**:

   - When a new **Grant** is added, the **Activity Feed** updates reactively. However, when editing and saving dirty data, a page refresh is required to reflect the changes.

2. **Cumulative Activities**:
   - When repeatedly changing the status of dirty data without saving, activities are added cumulatively, and when we save, all these activities are persisted at once.

---
