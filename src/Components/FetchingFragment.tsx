import React from "react";

function FetchingFragment(url: string, loadingElement: React.ReactElement,
                          errorFunc: (e: string | null) => React.ReactElement,
                          contentFunc: (c: any) => React.ReactElement) {

  const [data, setData] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setData(data || []);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load');
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return loadingElement;
  if (error) return errorFunc(error);
  return contentFunc(data);
}

export default FetchingFragment;
