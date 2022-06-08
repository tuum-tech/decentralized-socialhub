import React, { useMemo, useState } from 'react';
import { down } from 'styled-breakpoints';
import styled from 'styled-components';
import SpaceCard from '../SpaceCard';
import { getDIDString } from 'src/utils/did';
import Pagination from 'src/components/Pagination';

const Container = styled.div`
  --repeat: 3;
  display: grid;
  grid-template-columns: repeat(var(--repeat, auto-fit), minmax(240px, 1fr));
  row-gap: 22px;
  column-gap: 22px;
  margin: 22px 30px;

  ${down('sm')} {
    row-gap: 20px;
    margin: 22px 16px;
  }
  ${down('lg')} {
    --repeat: auto-fit;
  }
`;

interface Props {
  spaces: Space[];
  explore?: boolean;
  isVisiblePageCount?: boolean;
  pageCount?: number;
  searchQuery?: string;
}

interface PageCountProps {
  label: number;
  value: number;
}

interface PageProps {
  selected: number;
}

const SpaceListView: React.FC<Props> = ({
  spaces,
  explore = false,
  isVisiblePageCount = true,
  pageCount = 9,
  searchQuery
}: Props) => {
  const [pageOffset, setPageOffset] = useState(0);
  const [perPage, setPerPage] = useState<number>(pageCount);
  const totalPages = Math.ceil(spaces.length / perPage) ?? 1;

  const onPageCountChange = (selected: PageCountProps) => {
    setPerPage(selected.label);
  };

  const onPageChange = (data: PageProps) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    setPageOffset(offset);
  };

  const filteredSpaces = useMemo(() => {
    if (searchQuery) {
      return spaces.filter(
        v =>
          v.name?.toLowerCase().includes(searchQuery) ||
          v.owner?.includes(searchQuery)
      );
    }
    return spaces;
  }, [spaces, searchQuery]);

  return (
    <>
      <Container>
        {filteredSpaces
          .slice(pageOffset, pageOffset + perPage)
          .map((space: Space) => {
            const slug = space.slug;
            const guid = space.guid.value;
            return (
              <SpaceCard
                key={JSON.stringify(space)}
                space={space}
                explore={explore}
                link={
                  explore
                    ? space.isCommunitySpace
                      ? `/community-spaces/${slug}`
                      : `/did/${getDIDString(
                          space.owner as string,
                          true
                        )}/spaces/${slug}`
                    : `/spaces/edit/${guid}?type=${
                        space.isCommunitySpace ? `community` : `private`
                      }`
                }
                newTab={explore}
              />
            );
          })}
      </Container>
      {filteredSpaces.length > 0 && (
        <Pagination
          perPage={perPage}
          totalPages={totalPages}
          lists={filteredSpaces ?? []}
          onPageCountChange={onPageCountChange}
          onPageChange={onPageChange}
          isVisiblePageCount={isVisiblePageCount}
        />
      )}
    </>
  );
};

export default SpaceListView;
