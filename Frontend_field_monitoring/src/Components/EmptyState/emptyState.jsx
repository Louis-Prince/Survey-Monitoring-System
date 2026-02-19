import React from "react";
import "./emptyState.css";
import Button from "../Button/button";
import { EmptyStateType } from "../../constants/emptyStateType";

const EmptyState = ({
  type = EmptyStateType.NO_DATA,
  title,
  message,
  suggestion,
  icon,
  image,
  buttonText,
  onButtonClick,
  buttonIcon,
  searchTerm,
  filterName,
  filterValue,
  customContent,
  className = "",
  ...props
}) => {
  
  const getDefaultContent = () => {
    switch (type) {
      case EmptyStateType.NO_DATA:
        return {
          icon: icon || "",
          title: title || "No data available",
          message: message || "There are no items to display at the moment.",
          suggestion: suggestion || "Get started by creating your first item.",
          buttonText: buttonText || "Create New",
        };

      case EmptyStateType.NO_SEARCH_RESULTS:
        return {
          icon: icon || "",
          title: title || "No results found",
          message: message || (searchTerm  ? `We couldn't find anything matching "${searchTerm}"` : "No matches found for your search"),
          suggestion: suggestion || "Try checking your spelling or using different keywords",
        };

      case EmptyStateType.NO_FILTER_RESULTS:
        return {
          icon: icon || "",
          title: title || "No results found",
          message: message || (filterName && filterValue ? `No items found with ${filterName}: "${filterValue}"` : "No items match the selected filters"),
          suggestion: suggestion || "Try adjusting your filters to see more results",
        };

      case EmptyStateType.ERROR:
        return {
          icon: icon || "⚠️",
          title: title || "Something went wrong",
          message: message || "We couldn't load the data. Please try again.",
          suggestion: suggestion || "If the problem persists, contact support.",
          buttonText: buttonText || "Try Again",
        };

      default:
        return {
          icon,
          title,
          message,
          suggestion,
          buttonText,
        };
    }
  };

  const content = getDefaultContent();

  return (
    <div className={`empty-state empty-state--${type} ${className}`} {...props}>
      {customContent ? (
        customContent
      ) : (
        <>
          <div className="empty-state-icon-wrapper">
            {image ? (
              <img src={image} alt={content.title} className="empty-state-image" />
            ) : (
              <div className="empty-state-icon">{content.icon}</div>
            )}
          </div>

          <h3 className="empty-state-title">{content.title}</h3>

          {content.message && (
            <p className="empty-state-message">
              {content.message}
              {searchTerm && (
                <strong className="empty-state-highlight"> "{searchTerm}"</strong>
              )}
              {filterValue && (
                <strong className="empty-state-highlight"> {filterValue}</strong>
              )}
            </p>
          )}

          {content.suggestion && (
            <p className="empty-state-suggestion">{content.suggestion}</p>
          )}

          {content.buttonText && onButtonClick && (
            <Button
              text={content.buttonText}
              onClick={onButtonClick}
              icon={buttonIcon}
              iconPosition="left"
              variant="primary"
              otherStyles={{ marginTop: "24px" }}
            />
          )}
        </>
      )}
    </div>
  );
};

export const NoDataEmptyState = (props) => (
  <EmptyState type={EmptyStateType.NO_DATA} {...props} />
);

export const NoSearchResultsEmptyState = (props) => (
  <EmptyState type={EmptyStateType.NO_SEARCH_RESULTS} {...props} />
);

export const NoFilterResultsEmptyState = (props) => (
  <EmptyState type={EmptyStateType.NO_FILTER_RESULTS} {...props} />
);

export const ErrorEmptyState = (props) => (
  <EmptyState type={EmptyStateType.ERROR} {...props} />
);

export default EmptyState;