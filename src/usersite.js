import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useParams } from "react-router-dom";
import "./styles/user.scss"

const Usersite = () => {
  const { username } = useParams();
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsite = async () => {
      setLoading(true);
      // Make sure your Supabase table is named 'websites'
      const { data, error } = await supabase
        .from("app56")
        .select("html")
        .eq("username", username)
        .order("id", { ascending: false }) // Get the latest version
        .limit(1)
        .single();

      if (error) {
        setHtmlContent("<p>Error loading site.</p>");
      } else if (data && data.html) {
        setHtmlContent(data.html);
      } else {
        setHtmlContent("<p>No site found for this user.</p>");
      }
      setLoading(false);
    };

    if (username) fetchWebsite();
  }, [username]);

  if (loading) return <div>Loading...</div>;

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
  );
};

export default Usersite;