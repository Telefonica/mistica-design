import {useEffect, useState} from 'react';

const GetBranches = () => {
    const [branches, setBranches] = useState([]);
    
    useEffect(() => {
        const fetchBranches = async () => {
        const response = await fetch(
            `https://api.github.com/repos/Telefonica/mistica-design/branches`
        );
        const data = await response.json();
        setBranches(data.map((branch) => branch.name));
        };
        fetchBranches();
    }, []);
    
    return branches;
    };

export default GetBranches;
