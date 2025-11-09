'use client';

import { memo } from 'react';
import type { DataPoint } from '@/lib/types';
import { useVirtualization } from '@/hooks/useVirtualization';

interface DataTableProps {
  data: DataPoint[];
}

function DataTable({ data }: DataTableProps) {
  const { totalHeight, offsetY, visibleItems, handleScroll } = useVirtualization(data);
  
  return (
    <div style={{
      padding: '20px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 600 }}>
        Data Table (Virtual Scrolling)
      </h3>
      <div
        onScroll={handleScroll}
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead style={{
              position: 'sticky',
              top: 0,
              background: '#f5f5f5',
              zIndex: 1
            }}>
              <tr>
                <th style={{
                  padding: '10px',
                  textAlign: 'left',
                  borderBottom: '1px solid #eee',
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  Timestamp
                </th>
                <th style={{
                  padding: '10px',
                  textAlign: 'left',
                  borderBottom: '1px solid #eee',
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  Value
                </th>
                <th style={{
                  padding: '10px',
                  textAlign: 'left',
                  borderBottom: '1px solid #eee',
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  Category
                </th>
              </tr>
            </thead>
            <tbody style={{
              transform: `translateY(${offsetY}px)`
            }}>
              {visibleItems.map((item) => (
                <tr key={item.timestamp}>
                  <td style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    fontSize: '13px'
                  }}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </td>
                  <td style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    fontSize: '13px'
                  }}>
                    {item.value.toFixed(2)}
                  </td>
                  <td style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    fontSize: '13px'
                  }}>
                    {item.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default memo(DataTable);