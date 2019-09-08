import React from 'react';
import Grid from './Grid';
import ServiceHelper from '../utils/ServiceHelper';

class Main extends React.Component {
    
    state = {
        reposRankType: 'forks',
        reposOrganization: 'netflix',
        reposArray: []
    }

    sortRepos = (reposData) => {
        let rankType = this.state.reposRankType;
        reposData.sort((a,b) => {
            return (Number(a[rankType]) < Number(b[rankType])
                    ? 1
                    : (Number(a[rankType]) === Number(b[rankType])
                       ? 0
                       : -1));
        });
        
        /* TODO: Find better way of adding rank instead of looping through the list again. */
        let rank = 1;
        reposData.forEach((repo) => {
            repo.rank = rank++;
        });

        this.setState({
            reposArray: reposData
        });
    }

    processResponse = (response) => {
        this.sortRepos(response);
    }

    setRankType = (selectedRankType) => {
        this.setState({
            reposRankType: selectedRankType
        }, () => {
            this.sortRepos(this.state.reposArray);
        });
    }

    setOrganization = (selectedOrganization) => {
        this.setState({
            reposOrganization: selectedOrganization
        }, () => {
            this.setState({
                reposArray: []
            }, () => {
                this.getRepos();
            });
        });
    }

    getRepos = () => {
        ServiceHelper.getOrganizationRepos(this.state.reposOrganization, this.processResponse);
    }

    componentWillMount() {
       this.getRepos();
    }

    render() {
        return (
                <>
                    <div className="title">HubRank</div>
                    <div className="ranking-info">
                        <span>Github popularity ranking by:</span>
                        <select onChange={(event) => this.setRankType(event.currentTarget.value)}>
                            <option value="forks">Forks</option>
                            <option value="stargazers_count">Stargazers</option>
                            <option value="watchers_count">Watchers</option>
                        </select>
                        <span>of all repositories under:</span>
                        <select onChange={(event) => this.setOrganization(event.currentTarget.value)}>
                            <option value="netflix">Netflix</option>
                            <option value="tensorflow">TensorFlow</option>
                            <option value="ethereum">Ethereum</option>
                        </select>
                    </div>
                    <div className="grid-container">
                        <Grid
                            reposArray={this.state.reposArray}
                            reposRankType={this.state.reposRankType}
                        />
                    </div>
                </>
        );
    }
}

export default Main;