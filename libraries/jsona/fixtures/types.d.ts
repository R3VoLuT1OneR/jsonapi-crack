import { Collection, Resource } from "../types";

interface Article extends Resource<"articles", ["author", "editor"]> {
  title: string;
  author?: People | null;
  editor?: People | null;
  comments?: Comment[];
}

interface Comment extends Resource<"comments", ["author"]> {
  body: string;
  author?: People | null;
}

interface People extends Resource<"people"> {
  firstName: string;
  lastName: string;
}

type ArticleCollection = Collection<
  Article,
  {
    self: string;
    next: string;
    last: string;
  },
  {
    total: number;
  }
>;
