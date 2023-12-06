import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App";

// React アプリ用のコンテナ要素を作成する
const appContainer = document.createElement("div");
document.body.appendChild(appContainer);

// createRoot を使って React アプリをコンテナにレンダリングする
const root = createRoot(appContainer);
root.render(<App />);
