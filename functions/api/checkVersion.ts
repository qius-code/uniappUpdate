// Cloudflare Pages Functions entry
export const onRequestGet = async (context: any) => {
  // 读取客户端上报的版本与名称
  const url = new URL(context.request.url);
  const clientVersion = url.searchParams.get("version") || "";
  const clientName = url.searchParams.get("name") || "";

  // 从环境变量读取最新版本与 wgt 文件名
  const latestVersion = (context.env && context.env.LATEST_VERSION) || "1.0.1";
  const wgtFilename = (context.env && context.env.WGT_FILENAME) || "__UNI__002ED59.wgt";

  // 公开下载地址（Pages 静态目录）
  const origin = url.origin;
  const wgtUrl = `${origin}/wgts/${encodeURIComponent(wgtFilename)}`;

  // 简单版本比较：只要不相等就提示更新（生产可改成更严格的语义版本比较）
  const needsUpdate = !!clientVersion && clientVersion !== latestVersion;

  return new Response(
    JSON.stringify({
      update: needsUpdate,
      wgtUrl: needsUpdate ? wgtUrl : "",
      latestVersion,
      clientVersion,
      clientName,
    }),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    }
  );
};