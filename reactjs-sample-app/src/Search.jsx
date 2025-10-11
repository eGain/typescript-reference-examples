import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Egain } from "@egain/egain-api-typescript";
import { useAuth } from "./AuthContext";
import { egainConfig } from "./egainConfig";
import Header from "./Header";

// Memoized ResultItem component for better performance
const ResultItem = memo(({ result, onClick }) => (
  <div
    className="result-item clickable"
    onClick={() => onClick(result)}
    style={{ cursor: "pointer" }}
  >
    <h3 className="result-title">{result.name}</h3>
    <p
      className="result-snippet"
      dangerouslySetInnerHTML={{ __html: result.content }}
    />
  </div>
));

ResultItem.displayName = "ResultItem";

const Search = () => {
  const { userInfo, accessToken, logout } = useAuth();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [viewMode, setViewMode] = useState("search"); // "search" or "article"
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [client, setClient] = useState(null);

  // Initialize eGain client when access token is available
  useEffect(() => {
    if (accessToken) {
      const egainClient = new Egain({
        accessToken: accessToken,
      });
      setClient(egainClient);
    }
  }, [accessToken]);

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
      if (!query.trim() || !client) return;
      handleBackToSearch();

      setIsLoading(true);
      setError("");
      setResults([]);
      setHasSearched(false);

      try {
        // const searchResults = await client.portal.article.getArticleById({
        //   articleID: query,
        //   portalID: egainConfig.portalID,
        //   acceptLanguage: egainConfig.acceptLanguage,
        //   language: egainConfig.language,
        // });
        // setResults([searchResults]);
        const searchResults = await client.portal.search.aiSearch({
          q: query,
          portalID: egainConfig.portalID,
          acceptLanguage: egainConfig.acceptLanguage,
          language: egainConfig.language,
        });

        setResults(searchResults);
        setHasSearched(true);
        setSearchedQuery(query);
      } catch (err) {
        setError(err.message || "Search failed");
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    },
    [query, client]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, [logout]);

  const handleArticleClick = useCallback(
    async (article) => {
      if (!client) return;

      try {
        const response = await client.portal.article.getArticleById({
          articleID: article.id,
          portalID: egainConfig.portalID,
          acceptLanguage: egainConfig.acceptLanguage,
          language: egainConfig.language,
          articleAdditionalAttributes: ["content"],
        });
        setSelectedArticle(response);
        setViewMode("article");
      } catch (error) {
        console.error("Error loading article:", error);
        setError("Failed to load article details");
      }
    },
    [client]
  );

  const handleBackToSearch = useCallback(() => {
    setSelectedArticle(null);
    setViewMode("search");
  }, []);

  // Memoize search results to prevent unnecessary re-renders
  const memoizedResults = useMemo(() => results, [results]);

  return (
    <div className="search-container">
      <Header
        title="eGain AI Search"
        userInfo={userInfo}
        onLogout={handleLogout}
        showUserInfo={true}
      />

      <div className="search-form">
        <form onSubmit={handleSearch}>
          <div className="search-input-group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your search query..."
              className="search-input"
              disabled={isLoading || !client}
            />
            <button
              type="submit"
              className="search-button"
              disabled={isLoading || !query.trim() || !client}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {viewMode === "search" && (
        <>
          {memoizedResults.length > 0 && (
            <div className="search-results">
              <h4 style={{ marginBottom: "16px" }}>
                {memoizedResults.length} search result
                {memoizedResults.length !== 1 ? "s" : ""} found for "
                {searchedQuery}"
              </h4>
              <div className="results-list">
                {memoizedResults.map((result) => (
                  <ResultItem
                    key={result.id}
                    result={result}
                    onClick={handleArticleClick}
                  />
                ))}
              </div>
            </div>
          )}

          {hasSearched &&
            memoizedResults.length === 0 &&
            !isLoading &&
            !error && (
              <div className="no-results">
                <p>
                  No results found for "{searchedQuery}". Try a different search
                  term.
                </p>
              </div>
            )}
        </>
      )}

      {viewMode === "article" && selectedArticle && (
        <div className="article-detail">
          <div className="article-header">
            <button onClick={handleBackToSearch} className="back-button">
              ← Back to Search Results
            </button>
          </div>
          <div className="article-content">
            <h1 className="article-title">{selectedArticle.name}</h1>
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
