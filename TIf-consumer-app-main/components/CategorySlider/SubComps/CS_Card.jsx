const CS_Card = ({
  catName,
  catID,
  catActive,
  onClickCallback,
  isDisabled = false,
}) => {
  const catNameValue = Object.values(catName);
  const catActiveValue = catActive;

  return (
    <button
      key={catName}
      id={catID}
      onClick={() => onClickCallback(catName)}
      disabled={isDisabled}
      className={`${catNameValue.toString() === catActiveValue.toString()
          ? "font-semibold text-white bg-black disabled:bg-black/50"
          : "text-black dark:text-white disabled:text-black/50 dark:disabled:text-white/50 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 font-medium border border-gray-300 dark:border-transparent"
        } relative rounded-lg px-6 py-2.5 text-sm transition duration-200 ease-in-out`}
    >
      <h1>
        {console.log(
          "Name : " + Object.values(catName) + " | Active : " + catActive
        )}
        {catName}
      </h1>
    </button>
  );
};

export default CS_Card;
