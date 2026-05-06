import getProjectList from "@/api/projectList";
import { useQuery } from "@tanstack/react-query";
import type { ProjectList } from "@/types/types";

const useProjectList = () => {
    return useQuery<ProjectList[]>({
        queryKey: ['projectList'],
        queryFn: () => getProjectList()
    })
};


export default useProjectList;