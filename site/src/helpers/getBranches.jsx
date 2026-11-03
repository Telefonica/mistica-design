import { useEffect, useState } from 'react';

const useBranches = () => {
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await fetch(
                    `https://api.github.com/repos/Telefonica/mistica-design/branches`
                );
                if (!response.ok) return;
                const data = await response.json();
                if (!Array.isArray(data)) return;
                setBranches(data.map((branch) => branch.name));
            } catch {
                // Network failure or rate-limit — leave branches empty so the
                // selector renders with no options rather than crashing.
            }
        };
        fetchBranches();
    }, []);

    return branches;
};

export default useBranches;
