import { useLocalStorage } from "@/hooks/useLocaleStorage";
import { IResponsesData } from "@/types";
import { createContext, ReactNode, useContext } from "react";

type ResponsesContextType = {
  addResponse: (data: IResponsesData) => void;
  respondData: IResponsesData[];
};

const ResponsesContext = createContext({} as ResponsesContextType);

export function ResponsesProvider({ children }: { children: ReactNode }) {
  const [respondData, setRespondData] = useLocalStorage<IResponsesData[]>(
    "respond-data",
    [],
  );

  const addResponse = (data: IResponsesData) => {
    return setRespondData((prev) => [...prev, data]);
  };
  return (
    <ResponsesContext.Provider value={{ addResponse, respondData }}>
      {children}
    </ResponsesContext.Provider>
  );
}

export function useResponses() {
  return useContext(ResponsesContext);
}
