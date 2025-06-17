import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./styles/showcase.scss"; 

const Showcase = () => {
  const [websites, setWebsites] = useState([]);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const fetchWebsites = async () => {
      const { data, error } = await supabase
        .from("app56")
        .select("id, username, email, html")
        .order("id", { ascending: false });
      if (!error) setWebsites(data || []);
    };
    fetchWebsites();
  }, []);

  const handleLike = async (id) => {
    const currentLikes = likes[id] || 0;
    setLikes({ ...likes, [id]: currentLikes + 1 });

    await supabase
      .from("app56")
      .update({ likes: currentLikes + 1 })
      .eq("id", id);
  };

  return (
    <div className="showcase-bg">
      <h1 className="showcase-heading">PortfolioX</h1>
      <div className="showcase-cards">
        {websites.map((site) => (
          <div key={site.id} className="showcase-card">
            <div className="showcase-card-header">
              <strong className="showcase-card-username">{site.username}</strong>
              <div className="showcase-card-email">{site.email}</div>
            </div>
            <div
              className="showcase-card-preview"
              dangerouslySetInnerHTML={{ __html: site.html }}
            />
            <div className="showcase-card-footer">
              <button
                className="showcase-like-btn"
                onClick={() => handleLike(site.id)}
              >
                👍 Like ({site.likes !== undefined ? site.likes + (likes[site.id] || 0) : likes[site.id] || 0})
              </button>
              <a
                href={`/user/${site.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="showcase-view-link"
              >
                View Full Site
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Showcase;