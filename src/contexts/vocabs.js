import { createContext, useState } from "react";

const VocabStore = createContext();
export default VocabStore;

export const withVocabProvider = (WrappedComponent) => (props) => {
  const [keyword, setKeyword] = useState("");

  return (
    <VocabStore.Provider vocabData={{ keyword, setKeyword }}>
      <WrappedComponent {...props} />
    </VocabStore.Provider>
  );
};
