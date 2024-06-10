import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const Clients = () => {
    const [selectedClient, setSelectedClient] = useState('');
    const [from, setFrom] = useState(new Date().toISOString().split('T')[0]);
    const [to, setTo] = useState(new Date().toISOString().split('T')[0]);
    const [data, setData] = useState([]);
    const [adData, setAdData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [adSearchQuery, setAdSearchQuery] = useState('');

    const clients = [
        { name: "test" },
        { name: "unico" },
        { name: "fancy" }, 
        { name: "mipple" }
    ];

    const handleSelectChange = (event) => {
        setSelectedClient(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleAdSearchChange = (event) => {
        setAdSearchQuery(event.target.value);
    };

    const getData = async () => {
        try {
            const res = await axios.post('api/getAnalitics', {
                from,
                to,
                client: selectedClient
            });
            setData(res.data.result.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getDataDdr = async () => {
        try {
            const res = await axios.post('api/getAdData', {
                from,
                to,
                client: selectedClient
            });
            setAdData(res.data[0].data.rows);
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        { id: 'name', label: 'Озон' },
        { id: 'id', label: 'Id' },
        { id: 'hits_view_search', label: 'Показы в поиске и в категории' },
        { id: 'hits_view_pdp', label: 'Показы на карточке товара' },
        { id: 'hits_view', label: 'Всего показов' },
        { id: 'hits_tocart', label: 'Всего добавлено в корзину' },
        { id: 'session_view', label: 'Всего сессий' },
        { id: 'conv_tocart_search', label: 'Конверсия в корзину из поиска или категории' },
        { id: 'conv_tocart_pdp', label: 'Конверсия в корзину из карточки товара' },
        { id: 'conv_tocart', label: 'Общая конверсия в корзину' }
    ];

    const adColumns = [
        { id: 'title', label: 'Реклама' },
        { id: 'id', label: 'Id' },
        { id: 'objectType', label: 'Тип объекта' },
        { id: 'status', label: 'Статус' },
        { id: 'dailyBudget', label: 'Дневной бюджет' },
        { id: 'avgBid', label: 'Средняя ставка' },
        { id: 'clickPrice', label: 'Цена за клик' },
        { id: 'clicks', label: 'Клики' },
        { id: 'ctr', label: 'CTR' },
        { id: 'moneySpent', label: 'Потрачено денег' },
        { id: 'orders', label: 'Заказы' },
        { id: 'ordersMoney', label: 'Деньги от заказов' },
        { id: 'viewPrice', label: 'Цена за показ' },
        { id: 'views', label: 'Показы' },
    ];

    // Фильтрация данных по названию
    const filteredData = data.filter((row) => 
        row.dimensions[0].name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedAdData = [...adData].sort((a, b) => {
        if (a.status === 'running' && b.status !== 'running') {
            return -1;
        }
        if (a.status !== 'running' && b.status === 'running') {
            return 1;
        }
        return 0;
    });

    // Фильтрация рекламных данных по названию
    const filteredAdData =(sortedAdData?sortedAdData:adData).filter((row) =>
        row.title.toLowerCase().includes(adSearchQuery.toLowerCase())
    );

    // Сортировка adData так, чтобы элементы со статусом 'running' были первыми

    return (
        <div>
            <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                <FormControl>
                    <InputLabel id="client-select-label">Select Client</InputLabel>
                    <Select
                        label="Select Client"
                        labelId="client-select-label"
                        id="client-select"
                        value={selectedClient}
                        onChange={handleSelectChange}
                        style={{ width: '200px' }}
                    >
                        {clients.map((client) => (
                            <MenuItem key={client.name} value={client.name}>
                                {client.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="From"
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                />
                <TextField
                    label="To"
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={() => {
                        getDataDdr();
                        getData();
                    }}
                    disabled={!selectedClient}
                >
                    Get Data
                </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <TextField
                    label="Ozon"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <TextField
                    label="Ads"
                    value={adSearchQuery}
                    onChange={handleAdSearchChange}
                />
            </div>
            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }}>
                <TableContainer component={Paper} style={{ minWidth: '100%' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id}>{column.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.dimensions[0].name}</TableCell>
                                    <TableCell>{row.dimensions[0].id}</TableCell>
                                    {row.metrics.map((metric, idx) => (
                                        <TableCell key={idx}>{metric}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer component={Paper} style={{ minWidth: '100%' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {adColumns.map((column) => (
                                    <TableCell key={column.id}>{column.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAdData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.title}</TableCell>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.objectType}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.dailyBudget}</TableCell>
                                    <TableCell>{row.avgBid}</TableCell>
                                    <TableCell>{row.clickPrice}</TableCell>
                                    <TableCell>{row.clicks}</TableCell>
                                    <TableCell>{row.ctr}</TableCell>
                                    <TableCell>{row.moneySpent}</TableCell>
                                    <TableCell>{row.orders}</TableCell>
                                    <TableCell>{row.ordersMoney}</TableCell>
                                    <TableCell>{row.viewPrice}</TableCell>
                                    <TableCell>{row.views}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default Clients;
