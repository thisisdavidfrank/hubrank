import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class Grid extends React.Component {

    constructor() {
        super();
        this.setRankingColumnDefinition();
    }

    state = {
        reposRankType: '',
        reposArray: [],
        reposColumns: [],
    }

    columns = [
                {
                    Header: props => (<div className='header-cell rank-item'>Popularity Rank</div>),
                    width: 90,
                    accessor: 'rank',
                    Cell: props => (
                                    <div key={props.original.id + '_rank'}>
                                        <div className="info-cell rank-item">
                                            {props.value}
                                        </div>
                                    </div>
                                    )
                }, {
                    Header: props => (<div className='header-cell'>Repo Name</div>),
                    accessor: 'name',
                    width: 200,
                    Cell: props => (
                                    <div key={props.original.id + '_name'}>
                                        <div className="info-cell">
                                            <a target='_blank' href={props.original.html_url}>{props.value}</a>
                                        </div>
                                    </div>
                                    )
                }, {
                    Header: props => (<div className='header-cell'>Description</div>),
                    accessor: 'description',
                    width: 300,
                    Cell: props => (
                                    <div key={props.original.id + '_desc'}>
                                        <div className="info-cell">
                                            <span>{props.value}</span>
                                        </div>
                                    </div>
                                    )
                }, {
                    Header: props => (<div className='header-cell'>Repo Size</div>),
                    width: 100,
                    accessor: 'size',
                    Cell: props => (
                                    <div key={props.original.id + '_size'}>
                                        <div className="info-cell">
                                            <span>{Math.round(props.value / 1024) + ' MB'}</span>
                                        </div>
                                    </div>
                                )
                }
            ];

    rankingColumns = {
        forks: {
                Header: props => (<div className='header-cell'
                                       style={this.state.reposRankType === 'forks'
                                              ? {color: '#CE6900'}
                                              : {}}
                                       >
                                        Forks
                                  </div>),
                accessor: 'forks',
        },
        stargazers_count: {
                Header: props => (<div className='header-cell'
                                       style={this.state.reposRankType === 'stargazers_count'
                                              ? {color: '#CE6900'}
                                              : {}}
                                       >
                                        Stargazers
                                  </div>),
                accessor: 'stargazers_count',
        },
        watchers_count: {
                Header: props => (<div className='header-cell'
                                       style={this.state.reposRankType === 'watchers_count'
                                              ? {color: '#CE6900'}
                                              : {}}
                                       >
                                        Watchers
                                  </div>),
                accessor: 'watchers_count',
        }
    }

    setRankingColumnDefinition() {
        for (var rankType in this.rankingColumns) {
            let col = this.rankingColumns[rankType];
            col.width = 90;
            col.sortable = false;
            col.Cell = ((props) => (
                                    <div key={props.original.id + '_' + col.accessor}>
                                        <div className="info-cell"
                                             style={this.state.reposRankType === col.accessor
                                                    ? {color: '#CE6900'}
                                                    : {}}
                                            >
                                            {props.value}
                                        </div>
                                    </div>
                                  )
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        let reposRankType = nextProps.reposRankType;
        let reposRankTypeColumn = this.rankingColumns[reposRankType];
        let reposOtherTypesColumn = [];
        for (var rankType in this.rankingColumns) {
            if (rankType !== reposRankType) {
                reposOtherTypesColumn.push(
                    this.rankingColumns[rankType]
                );
            }
        }

        this.setState({
            reposColumns: [].concat(this.columns.slice(0,1),
                               reposRankTypeColumn,
                               this.columns.slice(1),
                               reposOtherTypesColumn)
        });

        this.setState({
            reposArray: nextProps.reposArray,
            reposRankType: nextProps.reposRankType
        });
    }

    render() {

        return <ReactTable
                        style={{width: '100%', height: 'calc(100vh - 80px)', background: this.state.reposArray.length > 0 ? '#FFFFFF' : '#282c34'}}
                        data={this.state.reposArray}
                        columns={this.state.reposColumns}
                        pageSize={this.state.reposArray.length}
                        showPageSizeOptions={false}
                        showPagination={false}
                        noDataText='Getting the entire repositories list...'
                />;
    }
}

export default Grid;