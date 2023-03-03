import { Utils } from "@antv/graphin";
import { useMemo } from "react";
import mockData from "./mockData";

const useData = (amount = 10) => {
  const data = useMemo(() => {
    if (!amount) {
      return mockData;
    }

    const data = Utils.mock(amount)
      .tree()
      .graphin();

    return {
      nodes: data.nodes.map(_ => ({
        id: _.id
      })),
      edges: data.edges.map(_ => ({
        source: _.source,
        target: _.target
      }))
    };
  }, [amount]);

  return data;
};

export default useData;
