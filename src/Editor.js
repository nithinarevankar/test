import React, { useState, useEffect } from "react";
import grapesjs from "grapesjs";
import "./styles/main.scss";
import PresetWebpage from "grapesjs-preset-webpage";
import navbar from "grapesjs-navbar";
import basic from "grapesjs-blocks-basic";
import forms from "grapesjs-plugin-forms";
import { supabase } from "./supabaseClient";

// Upload HTML to Supabase Storage
async function uploadWebsiteToStorage(html, username) {
  const file = new Blob([html], { type: "text/html" });
  const path = `sites/${username}/index.html`;
  const { data, error } = await supabase.storage
    .from("app56")
    .upload(path, file, { upsert: true, contentType: "text/html" });

  if (error) {
    alert("Storage upload error: " + error.message);
    return null;
  }
  return path;
}

// Save metadata to Supabase Table
async function saveWebsiteToTable({ username, email, storage_path, html }) {
  
  const { data, error } = await supabase
    .from("app56")
    .insert([{ username, email, storage_path,html }]);

  if (error) {
    alert("Database save error: " + error.message);
    return false;
  }
  alert("Website published and saved!");
  return true;
}

const Editor = () => {
  useEffect(() => {
    const editorInstance = grapesjs.init({
      container: "#editor",
      plugins: [PresetWebpage, navbar, basic, forms],
      pluginsOpts: {
        PresetWebpage: {},
        navbar: {},
        basic: {},
        forms: {},
      },
    });

    editorInstance.Panels.addButton("options", {
      id: "save-publish",
      className: "fa fa-cloud-upload",
      label: "Save & Publish",
      command: async () => {
        const html = editorInstance.getHtml();
        const css = editorInstance.getCss();
        const fullhtml = "<style>" + css + "</style>" + html;
        const username = prompt("Username:");
        if (!username) return alert("Username is required!");
        const email = prompt("Email:");
        if (!email) return alert("Email is required!");

        // 1. Upload to Storage
        const storage_path = await uploadWebsiteToStorage(fullhtml, username);
        if (!storage_path) return;

        // 2. Save to Table
        await saveWebsiteToTable({
          username,
          email,
          storage_path,
          html: fullhtml,
        });
      },
    });
  }, []);

  return (
    <div className="App">
      <div id="editor"></div>
    </div>
  );
};

export default Editor;