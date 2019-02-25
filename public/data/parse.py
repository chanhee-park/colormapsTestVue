import json
import os.path

import graph_tool.all as gt
import numpy as np
import matplotlib.pyplot as plt

# This code only works in macOS and Linux
# In macOS,
# 1. install Homebrew <https://brew.sh/>
# 2. install graph-tool <https://graph-tool.skewed.de/>
#    brew install graph-tool


def draw_graph(g,
               pos,
               filename,
               vp_color=None,
               vcmap=None,
               output_size=(1024, 1024)):
    gt.graph_draw(
        g,
        pos,
        vertex_text=g.vertex_index,
        vertex_halo=False,
        vertex_color=(0, 0, 0, 0),  # vertex stroke color
        vertex_fill_color=vp_color,
        vcmap=plt.get_cmap(vcmap),
        vertex_font_family='Helvetica',
        vertex_font_size=10,
        edge_color=(0.1, 0.1, 0.1, 0.25),
        output=os.path.join('images', filename),
        output_size=output_size)


def process(name, g):
    # Properties
    vp_pos = gt.sfdp_layout(g)
    vp_deg = g.degree_property_map('total')
    vp_deg_log = g.new_vp('double')
    vp_deg_log.a = np.log10(vp_deg.a)
    vp_cls = gt.closeness(g)
    vp_page = gt.pagerank(g)
    vp_btw, ep_btw = gt.betweenness(g, norm=False)

    # Colormaps
    for cmap in [
            'viridis', 'plasma', 'inferno', 'YlGnBu', 'Blues', 'Greys',
            'Greens', 'Oranges'
    ]:
        draw_graph(
            g,
            vp_pos,
            f'{name}.prop=deg.color={cmap}.png',
            vp_color=vp_deg,
            vcmap=cmap)
        draw_graph(
            g,
            vp_pos,
            f'{name}.prop=deg_log.color={cmap}.png',
            vp_color=vp_deg_log,
            vcmap=cmap)
        draw_graph(
            g,
            vp_pos,
            f'{name}.prop=cls.color={cmap}.png',
            vp_color=vp_cls,
            vcmap=cmap)
        draw_graph(
            g,
            vp_pos,
            f'{name}.prop=page.color={cmap}.png',
            vp_color=vp_page,
            vcmap=cmap)
        draw_graph(
            g,
            vp_pos,
            f'{name}.prop=btw.color={cmap}.png',
            vp_color=vp_btw,
            vcmap=cmap)

    # Construct dicts for D3-style JSON
    nodes = []
    for u in g.vertices():
        p = vp_pos[u]
        nodes.append({
            'x': p[0],
            'y': p[1],
            'deg': vp_deg[u],
            'deg_log': vp_deg_log[u],
            'cls': vp_cls[u],
            'page': vp_page[u],
            'btw': vp_btw[u],
        })

    vp_idx = g.vertex_index
    links = [{
        'source': vp_idx[e.source()],
        'target': vp_idx[e.target()],
    } for e in g.edges()]

    # Save D3 style JSON
    d = {'nodes': nodes, 'links': links}
    with open(f'{name}.json', 'w') as f:
        json.dump(d, f)


def main():
    # The description about the data is available at
    # <https://graph-tool.skewed.de/static/doc/collection.html>
    for name in ['karate', 'lesmis', 'football', 'dolphins', 'netscience']:
        g = gt.collection.data[name]
        g = gt.GraphView(g, directed=False)

        if name == 'netscience':
            # Use only the largest component in the netscience data
            l = gt.label_largest_component(g)
            g = gt.Graph(gt.GraphView(g, vfilt=l), prune=True)

        process(name, g)


if __name__ == '__main__':
    main()