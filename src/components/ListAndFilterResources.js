import React, { useEffect, useState } from 'react';
import {
  Layout,
  Content,
  Menu,
  Sider,
  Select,
  Affix,
  Space,
  Spin,
} from '../ant';
import ResourceCard from '../components/ResourceCard';
import { useAppEnv } from '../env';
import { FilterTwoTone } from '@ant-design/icons';

export default function ListAndFilterResources({
  orgTypes,
  resourceTypes,
  fileTypes,
  resourcePath,
  query,
}) {
  let { api } = useAppEnv();
  let [resources, setResources] = useState(null);
  let [loading, setLoading] = useState(true);
  let [topics, setTopics] = useState([]);
  let [orgs, setOrgs] = useState([]);
  let [filterVals, setFilterVals] = useState({});
  useEffect(() => {
    api.get('/api/organizations').then((orgs) => setOrgs(orgs));
    api.get('/api/topics').then((topics) => setTopics(topics));
  }, [api]);
  useEffect(() => {
    setLoading(true);
    api
      .get('/api/resources', { query: query, ...filterVals })
      .then((resources) => {
        setResources(resources);
        setLoading(false);
      });
  }, [query, filterVals, api]);
  let updateFilters = (newFilters) => {
    setFilterVals({ ...filterVals, ...newFilters });
  };
  return (
    <Layout>
      <Affix offsetTop={64}>
        <Sider width={200}>
          <Menu
            mode="inline"
            theme="light"
            defaultSelectedKeys={['topics']}
            defaultOpenKeys={['topics', 'groups']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item style={{ marginTop: '10px' }}>
              <h1
                style={{
                  fontSize: '1.2em',
                  width: '100%',
                  fontWeight: 'bolder',
                }}
              >
                <FilterTwoTone style={{ fontSize: '1em' }} />
                Filters
              </h1>
            </Menu.Item>
            <Menu.Item key="orgs" disabled>
              <Select
                onChange={(v) => updateFilters({ organizationId: v })}
                showSearch
                defaultValue="Organization"
                style={{ width: '100%' }}
              >
                {orgs.map((org) => (
                  <Select.Option value={org._id}>{org.name}</Select.Option>
                ))}
              </Select>
            </Menu.Item>
            <Menu.Item key="orgTypes" disabled>
              <Select
                showSearch
                onChange={(e) => updateFilters({ organizationType: e })}
                defaultValue="Organization Type"
                style={{ width: '100%' }}
              >
                {orgTypes.map((res) => (
                  <Select.Option value={res}>{res}</Select.Option>
                ))}
              </Select>
            </Menu.Item>
            <Menu.Item key="resourceTypes" disabled>
              <Select
                showS
                onChange={(e) => updateFilters({ resourceType: e })}
                defaultValue="Resource Type"
                style={{ width: '100%' }}
              >
                {resourceTypes.map((res) => (
                  <Select.Option value={res}>{res}</Select.Option>
                ))}
              </Select>
            </Menu.Item>
            <Menu.Item key="paths" disabled>
              <Select
                showSearch
                onChange={(e) => updateFilters({ resourcePath: e })}
                defaultValue="Resource Path"
                style={{ width: '100%' }}
              >
                {resourcePath.map((res) => (
                  <Select.Option value={res}>{res}</Select.Option>
                ))}
              </Select>
            </Menu.Item>
            <Menu.Item key="fileTypes" disabled>
              <Select
                onChange={(e) => updateFilters({ format: e })}
                defaultValue="Format"
                style={{ width: '100%' }}
              >
                {fileTypes.map((res) => (
                  <Select.Option value={res.ext}>{res.name}</Select.Option>
                ))}
              </Select>
            </Menu.Item>
            <Menu.Item key="sort" disabled>
              <Select
                onChange={(e) => updateFilters({ sortBy: e })}
                defaultValue="Sort By"
                style={{ width: '100%' }}
              >
                <Select.Option value="relevance">Relevance</Select.Option>
                <Select.Option value="title">Title</Select.Option>
                <Select.Option value="date">Date</Select.Option>
              </Select>
            </Menu.Item>
            <Menu.Item key="topics" disabled>
              <Select
                onChange={(e) => updateFilters({ topic: e })}
                defaultValue="Topics"
                style={{ width: '100%' }}
              >
                {topics.map((res) => (
                  <Select.Option value={res.name}>{res.name}</Select.Option>
                ))}
              </Select>
            </Menu.Item>
          </Menu>
        </Sider>
      </Affix>
      <Layout style={{ padding: '24px 24px 24px' }}>
        <Content>
          {!loading && (
            <Space direction="vertical" style={{ width: '100%' }}>
              {resources.map((res) => (
                <ResourceCard key={res._id} resource={res} />
              ))}
            </Space>
          )}
          {loading && <Spin />}
        </Content>
      </Layout>
    </Layout>
  );
}
